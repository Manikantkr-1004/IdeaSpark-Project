'use client';

import { UserContext } from "@/app/context/UserContext";
import { ideaDataType } from "@/app/lib/ideaDataType/ideaType";
import { ResponseType } from "@/app/lib/userDataType/userType";
import ComparisionIdeaModal from "@/app/ui/Modals/comparisionIdea";
import CreateIdeaModal from "@/app/ui/Modals/createIdea";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { TbMoodEmptyFilled } from "react-icons/tb";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function UserIdeas() {

    const [aiComparision, setAiComparision] = useState<boolean>(false);
    const [createModal, setCreateModal] = useState<boolean>(false);

    const [comparisionModal, setComparisionModal] = useState<boolean>(false);
    const [data, setData] = useState<{id: string, content: string}[]>([]);

    const {user} = useContext(UserContext);
    const [query, setQuery] = useState<{heading: string, category: string}>({heading: '', category: ''})

    const [ideaData, setIdeaData] = useState<ideaDataType[]>([]);
    const [fetchLoading, setFetchLoading] = useState<boolean>(false);

    useEffect(() => {
        if(createModal) return;
        fetchAuthorIdeas();
    }, [createModal]);

    const fetchAuthorIdeas = async () => {
        if(!user.token) return;
        setFetchLoading(true);
        try {
            const response = await axios.get(`${BACKEND_API}/idea/author?heading=${query.heading}&category=${query.category}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            });
            const data: ResponseType = response.data;
            setIdeaData(data?.data);
        } catch (error: any) {
            console.log('Error is author idea fetch', error);
            toast.error(error?.response?.data?.message || 'Internal Server Error')
        } finally {
            setFetchLoading(false);
        }
    }

    const updateIdeaData = (name: string, value: string, id: string) => {
        const updatedData = ideaData.map((ele)=> ele._id === id ? ({...ele, [name]: value}) : ele);
        setIdeaData(updatedData);
    }

    const updateIdea = async(ele: ideaDataType) => {
        if(!ele.heading.trim() || !ele.content.trim() || !ele.category.trim()){
            return toast.error('Fields should not be empty')
        }
        setFetchLoading(true);

        try {
            const response = await axios.put(`${BACKEND_API}/idea/update/${ele._id}`, {
                heading: ele.heading,
                content: ele.content,
                category: ele.category,
                visibility: ele.visibility
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            });

            const data: ResponseType = response.data;
            toast.success(data?.message || 'Idea updated successfully')
        } catch (error: any) {
            console.log('Error in updating Idea', error);
            toast.error(error?.response?.data?.message || 'Internal Error');
        } finally {
            setFetchLoading(false);
        }
    }

    const deleteIdea = async(ele: ideaDataType) => {
        setFetchLoading(true);

        try {
            const response = await axios.delete(`${BACKEND_API}/idea/delete/${ele._id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            });

            const data: ResponseType = response.data;
            toast.success(data?.message || 'Idea deleted successfully')

            const updatedData = ideaData.filter((item)=> item._id !== ele._id);
            setIdeaData(updatedData);

        } catch (error: any) {
            console.log('Error in updating Idea', error);
            toast.error(error?.response?.data?.message || 'Internal Error');
        } finally {
            setFetchLoading(false);
        }
    }

    const handleAddIdea = (id: string, content: string)=> {
        let updatedData = [...data];
        const checkExist = updatedData.find((ele)=> ele.id === id);

        if(data.length>=2 && !checkExist){
            updatedData.shift();
        }
        updatedData = checkExist ? updatedData.filter((ele)=> ele.id !==id) : [...updatedData, {id, content}];
        setData(updatedData)
    }
    const checkExist = (id: string) : boolean => {
        const checkExist = data.find((ele)=> ele.id === id);
        return checkExist? true: false;
    }


    return (
        <>
            <main className="w-full line-bg bg-no-repeat bg-top min-h-screen px-3 md:px-5 lg:px-10">
                <div className="w-full py-16 md:py-28 2xl:py-32">
                    <h2 className="text-3xl font-bold text-(--dark-color) text-center">✨ Manage Ideas</h2>

                    <div className="w-full mt-5 flex justify-center items-center flex-wrap gap-2 sm:gap-4">
                        <input
                            disabled={aiComparision || fetchLoading}
                            value={query.heading} onChange={(e)=> setQuery((prev)=> ({...prev, heading: e.target.value}))}
                            className="w-[45%] sm:w-[30%] xl:w-[18%] bg-white border border-slate-300 p-1.5 rounded-md" placeholder="Search by Heading" type="search" name="title" id="title" />
                        <input
                            disabled={aiComparision || fetchLoading}
                            value={query.category} onChange={(e)=> setQuery((prev)=> ({...prev, category: e.target.value}))}
                            className="w-[45%] sm:w-[30%] xl:w-[18%] bg-white border border-slate-300 p-1.5 rounded-md" placeholder="Search by Category" type="search" name="category" id="category" />
                        <button
                            disabled={aiComparision || fetchLoading}
                            onClick={fetchAuthorIdeas}
                            className={`w-[98%] sm:w-[30%] xl:w-[18%] py-1.5 px-3 font-semibold text-white rounded-md ${(aiComparision || fetchLoading) ? 'bg-(--dark-color)/50 cursor-not-allowed':'bg-(--dark-color) cursor-pointer'}`}>
                                {fetchLoading? '...':'Search'}
                            </button>

                        <div className="w-auto xl:w-[18%] text-sm sm:text-[16px] flex items-center gap-1 font-semibold">
                            ✨ AI Comparision
                            <input 
                            disabled={fetchLoading}
                            checked={aiComparision} onChange={(e) => setAiComparision(e.target.checked)} type="checkbox" name="ai" id="ai" />
                        </div>
                        {aiComparision &&
                        <button
                            disabled={fetchLoading || data.length!==2}
                            onClick={() => setComparisionModal(true)}
                            className={`w-[45%] sm:w-auto xl:w-[18%] py-1.5 px-3 text-sm sm:text-[16px] font-semibold text-white rounded-md ${(fetchLoading || data.length!==2) ? 'bg-(--dark-color)/50 cursor-not-allowed':'bg-(--dark-color) cursor-pointer'}`}>✨ Compare</button>
                        }
                        {!aiComparision &&
                        <button
                            disabled={aiComparision || fetchLoading}
                            onClick={() => setCreateModal(true)}
                            className={`w-[45%] sm:w-auto xl:w-[18%] py-1.5 px-3 text-sm sm:text-[16px] font-semibold text-white rounded-md ${(aiComparision || fetchLoading) ? 'bg-(--dark-color)/50 cursor-not-allowed':'bg-(--dark-color) cursor-pointer'}`}>✨ Generate/Create</button>
                        }
                    </div>

                    {
                        !fetchLoading && ideaData.length===0 && (
                            <div className="w-full py-20 flex flex-col justify-center items-center gap-5">
                                <p className="text-slate-700"><TbMoodEmptyFilled size={200} /></p>
                                <p className="text-center text-slate-700">Oops! No Data. Try to Create One.</p>
                            </div>
                        )
                    }

                    {
                        fetchLoading && (
                            <div className="w-full py-20 flex justify-center items-center">
                                <div className="loader"></div>
                            </div>
                        )
                    }

                    {!fetchLoading && ideaData.length>0 &&
                    <div className="w-full mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {
                            ideaData?.map((ele: ideaDataType) => (
                                <div key={ele._id} className="p-2 animate__animated animate__zoomIn self-start border border-dashed border-(--light-color) bg-(--light-color)/30 rounded-md">
                                    <input 
                                    disabled={aiComparision || fetchLoading}
                                    onChange={(e)=> updateIdeaData('heading', e.target.value, ele._id)} 
                                    value={ele.heading} className="w-full p-1 font-semibold mb-3 text-(--dark-color)" />

                                    <textarea 
                                    disabled={aiComparision || fetchLoading}
                                    onChange={(e)=> updateIdeaData('content', e.target.value, ele._id)} 
                                    value={ele.content} className="text-sm w-full min-h-30 p-1" />

                                    <div className="w-full flex justify-between items-center gap-5 mt-3">
                                        <input 
                                        disabled={aiComparision || fetchLoading}
                                        onChange={(e)=> updateIdeaData('category', e.target.value, ele._id)}
                                        value={ele.category} className="bg-slate-700 p-1 w-1/3 rounded-full text-xs text-white font-semibold" />
                                        <select 
                                        disabled={aiComparision || fetchLoading}
                                        onChange={(e)=> updateIdeaData('visibility', e.target.value, ele._id)}
                                        value={ele.visibility}
                                        className={`text-xs text-white font-semibold rounded-full py-1 px-3 ${ele.visibility==='public' ? 'bg-green-500':'bg-blue-500'}`}>
                                            <option value="private">Private</option>
                                            <option value="public">Public</option>
                                        </select>
                                    </div>

                                    <div className="w-full flex justify-center items-center gap-5 mt-3">
                                        {aiComparision &&
                                        <input className="w-7 h-7" type="checkbox" 
                                        onChange={(e)=> handleAddIdea(ele._id, ele.content)}
                                        checked={checkExist(ele._id)} />
                                        }

                                        <button
                                        disabled={fetchLoading || aiComparision} 
                                        onClick={()=> updateIdea(ele)}
                                        title="Update Idea"
                                        className={`px-5 ${(aiComparision || fetchLoading) ? 'bg-(--dark-color)/50 cursor-not-allowed':'bg-(--dark-color) cursor-pointer'} py-2 rounded-md text-sm text-white`}>
                                            <FaPencilAlt />
                                        </button>
                                        <button
                                        disabled={fetchLoading || aiComparision} 
                                        onClick={()=> deleteIdea(ele)}
                                        title="Delete Idea"
                                        className={`px-5 ${(aiComparision || fetchLoading) ? 'bg-red-500/50 cursor-not-allowed':'bg-red-500 cursor-pointer'} py-2 rounded-md text-sm text-white`}>
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