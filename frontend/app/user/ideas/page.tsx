'use client';

import { ideaDataType } from "@/app/lib/ideaDataType/ideaType";
import { ResponseType } from "@/app/lib/userDataType/userType";
import ComparisionIdeaModal from "@/app/ui/Modals/comparisionIdea";
import CreateIdeaModal from "@/app/ui/Modals/createIdea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { TbMoodEmptyFilled } from "react-icons/tb";

export default function UserIdeas() {

    const [aiComparision, setAiComparision] = useState<boolean>(false);
    const [createModal, setCreateModal] = useState<boolean>(false);

    const [comparisionModal, setComparisionModal] = useState<boolean>(false);
    const [data, setData] = useState<{ id: string, content: string }[]>([]);

    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const [query, setQuery] = useState<{ heading: string, category: string }>({ heading: '', category: '' })

    const { data: ideaData, isPending: fetchLoading, isFetching, refetch } = useQuery<ideaDataType[]>({
        queryKey: ['user-ideas', session?.user.accessToken],
        queryFn: async () => {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/idea/author`,
                {
                    params: query,
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`
                    }
                }
            );
            return response.data.data;
        },
        enabled: !!session, // Wait for session (your if (!session) return)
        staleTime: 10 * 60 * 1000, // 10min cache
        gcTime: 30 * 60 * 1000, // 30 min for garbage throw
    });

    const { mutate: updateIdeaMutate, isPending: updateLoading } = useMutation({
        mutationFn: async (idea: ideaDataType) => {
            if (!idea.heading.trim() || !idea.content.trim() || !idea.category.trim()) {
                throw new Error('Heading, Content and Category cannot be empty');
            }
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/idea/update/${idea._id}`,
                {
                    heading: idea.heading,
                    content: idea.content,
                    category: idea.category,
                    visibility: idea.visibility
                },
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`
                    }
                }
            );
            return response.data;
        },
        onSuccess: (data: ResponseType) => {
            toast.success(data?.message || 'Idea updated successfully')
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Internal Error');
        },
    });

    const { mutate: deleteIdeaMutate, isPending: deleteLoading } = useMutation({
        mutationFn: async (ideaId: string) => {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/idea/delete/${ideaId}`, {
                headers: {
                    Authorization: `Bearer ${session?.user.accessToken}`
                }
            });
            return response.data;
        },
        onMutate: async (ideaId) => {
            await queryClient.cancelQueries({ queryKey: ['user-ideas', session?.user.accessToken] });

            const previousIdeas = queryClient.getQueryData<ideaDataType[]>(['user-ideas', session?.user.accessToken]);

            // Optimistically remove from cache
            queryClient.setQueryData(['user-ideas', session?.user.accessToken], (old: ideaDataType[] | undefined) =>
                old?.filter(idea => idea._id !== ideaId) || []
            );

            return { previousIdeas };
        },
        onError: (err: any, ideaId, context) => {
            if (context?.previousIdeas) {
                queryClient.setQueryData(['user-ideas', session?.user.accessToken], context.previousIdeas);
            }
            toast.error(err?.response?.data?.message || 'Internal Server Error');
        },
        onSuccess: (data: ResponseType) => {
            toast.success(data?.message || 'Deleted Successful');
        },
    });

    const updateIdeaData = (name: string, value: string, id: string) => {
        queryClient.setQueryData(['user-ideas', session?.user.accessToken], (old: ideaDataType[] | undefined) =>
            old?.map((ele) => ele._id === id ? { ...ele, [name]: value } : ele ) || []
        );
    };

    const handleAddIdea = (id: string, content: string) => {
        let updatedData = [...data];
        const checkExist = updatedData.find((ele) => ele.id === id);

        if (data.length >= 2 && !checkExist) {
            updatedData.shift();
        }
        updatedData = checkExist ? updatedData.filter((ele) => ele.id !== id) : [...updatedData, { id, content }];
        setData(updatedData)
    }

    const checkExist = (id: string): boolean => {
        const checkExist = data.find((ele) => ele.id === id);
        return checkExist ? true : false;
    }


    return (
        <>
            <main className="w-full line-bg bg-no-repeat bg-top min-h-screen px-3 md:px-5 lg:px-10">
                <div className="w-full py-16 md:py-28 2xl:py-32">
                    <h2 className="text-3xl font-bold text-(--dark-color) text-center">✨ Manage Ideas</h2>

                    <div className="w-full mt-5 flex justify-center items-center flex-wrap gap-2 sm:gap-4">
                        <input
                            disabled={aiComparision || fetchLoading || isFetching || updateLoading || deleteLoading}
                            value={query.heading} onChange={(e) => setQuery((prev) => ({ ...prev, heading: e.target.value }))}
                            className="w-[45%] sm:w-[30%] xl:w-[18%] bg-white border border-slate-300 p-1.5 rounded-md" placeholder="Search by Heading" type="search" name="title" id="title" />
                        <input
                            disabled={aiComparision || fetchLoading || isFetching || updateLoading || deleteLoading}
                            value={query.category} onChange={(e) => setQuery((prev) => ({ ...prev, category: e.target.value }))}
                            className="w-[45%] sm:w-[30%] xl:w-[18%] bg-white border border-slate-300 p-1.5 rounded-md" placeholder="Search by Category" type="search" name="category" id="category" />
                        <button
                            disabled={aiComparision || fetchLoading || isFetching || updateLoading || deleteLoading}
                            onClick={()=> refetch()}
                            className={`w-[98%] sm:w-[30%] xl:w-[18%] py-1.5 px-3 font-semibold text-white rounded-md ${(aiComparision || fetchLoading) ? 'bg-(--dark-color)/50 cursor-not-allowed' : 'bg-(--dark-color) cursor-pointer'}`}>
                            {fetchLoading ? '...' : 'Search'}
                        </button>

                        <div className="w-auto xl:w-[18%] text-sm sm:text-[16px] flex items-center gap-1 font-semibold">
                            ✨ AI Comparision
                            <input
                                disabled={fetchLoading || isFetching || updateLoading || deleteLoading}
                                checked={aiComparision} onChange={(e) => setAiComparision(e.target.checked)} type="checkbox" name="ai" id="ai" />
                        </div>
                        {aiComparision &&
                            <button
                                disabled={fetchLoading  || isFetching || updateLoading || deleteLoading || data.length !== 2}
                                onClick={() => setComparisionModal(true)}
                                className={`w-[45%] sm:w-auto xl:w-[18%] py-1.5 px-3 text-sm sm:text-[16px] font-semibold text-white rounded-md ${(fetchLoading || data.length !== 2) ? 'bg-(--dark-color)/50 cursor-not-allowed' : 'bg-(--dark-color) cursor-pointer'}`}>✨ Compare</button>
                        }
                        {!aiComparision &&
                            <button
                                disabled={aiComparision || fetchLoading || isFetching || updateLoading || deleteLoading}
                                onClick={() => setCreateModal(true)}
                                className={`w-[45%] sm:w-auto xl:w-[18%] py-1.5 px-3 text-sm sm:text-[16px] font-semibold text-white rounded-md ${(aiComparision || fetchLoading) ? 'bg-(--dark-color)/50 cursor-not-allowed' : 'bg-(--dark-color) cursor-pointer'}`}>✨ Generate/Create</button>
                        }
                    </div>

                    {
                        !fetchLoading && !isFetching && !updateLoading && !deleteLoading && ideaData?.length === 0 && (
                            <div className="w-full py-20 flex flex-col justify-center items-center gap-5">
                                <p className="text-slate-700"><TbMoodEmptyFilled size={200} /></p>
                                <p className="text-center text-slate-700">Oops! No Data. Try to Create One.</p>
                            </div>
                        )
                    }

                    {
                        (fetchLoading || isFetching || updateLoading || deleteLoading) && (
                            <div className="w-full py-20 flex justify-center items-center">
                                <div className="loader"></div>
                            </div>
                        )
                    }

                    {!fetchLoading && !isFetching && !updateLoading && !deleteLoading && (ideaData ? ideaData.length>0 : false) &&
                        <div className="w-full mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {
                                ideaData?.map((ele: ideaDataType) => (
                                    <div key={ele._id} className="p-2 animate__animated animate__zoomIn self-start border border-dashed border-(--light-color) bg-(--light-color)/30 rounded-md">
                                        <input
                                            disabled={aiComparision || fetchLoading}
                                            onChange={(e) => updateIdeaData('heading', e.target.value, ele._id)}
                                            value={ele.heading} className="w-full p-1 font-semibold mb-3 text-(--dark-color)" />

                                        <textarea
                                            disabled={aiComparision || fetchLoading}
                                            onChange={(e) => updateIdeaData('content', e.target.value, ele._id)}
                                            value={ele.content} className="text-sm w-full min-h-30 p-1" />

                                        <div className="w-full flex justify-between items-center gap-5 mt-3">
                                            <input
                                                disabled={aiComparision || fetchLoading}
                                                onChange={(e) => updateIdeaData('category', e.target.value, ele._id)}
                                                value={ele.category} className="bg-slate-700 p-1 w-1/3 rounded-full text-xs text-white font-semibold" />
                                            <select
                                                disabled={aiComparision || fetchLoading}
                                                onChange={(e) => updateIdeaData('visibility', e.target.value, ele._id)}
                                                value={ele.visibility}
                                                className={`text-xs text-white font-semibold rounded-full py-1 px-3 ${ele.visibility === 'public' ? 'bg-green-500' : 'bg-blue-500'}`}>
                                                <option value="private">Private</option>
                                                <option value="public">Public</option>
                                            </select>
                                        </div>

                                        <div className="w-full flex justify-center items-center gap-5 mt-3">
                                            {aiComparision &&
                                                <input className="w-7 h-7" type="checkbox"
                                                    onChange={(e) => handleAddIdea(ele._id, ele.content)}
                                                    checked={checkExist(ele._id)} />
                                            }

                                            <button
                                                disabled={fetchLoading || aiComparision}
                                                onClick={() => updateIdeaMutate(ele)}
                                                title="Update Idea"
                                                className={`px-5 ${(aiComparision || fetchLoading) ? 'bg-(--dark-color)/50 cursor-not-allowed' : 'bg-(--dark-color) cursor-pointer'} py-2 rounded-md text-sm text-white`}>
                                                <FaPencilAlt />
                                            </button>
                                            <button
                                                disabled={fetchLoading || aiComparision}
                                                onClick={() => deleteIdeaMutate(ele._id)}
                                                title="Delete Idea"
                                                className={`px-5 ${(aiComparision || fetchLoading) ? 'bg-red-500/50 cursor-not-allowed' : 'bg-red-500 cursor-pointer'} py-2 rounded-md text-sm text-white`}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    }

                </div>
            </main>

            <CreateIdeaModal createModal={createModal} setCreateModal={setCreateModal} />
            <ComparisionIdeaModal data={data} comparisionModal={comparisionModal} setComparisionModal={setComparisionModal} />
        </>
    )
};