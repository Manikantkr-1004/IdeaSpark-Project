'use client';

import { ResponseType } from "@/app/lib/userDataType/userType";
import ComparisionIdeaModal from "@/app/ui/Modals/comparisionIdea";
import axios from "axios";
import { useCallback, useRef, useState } from "react";
import { FaFileImage, FaPencilAlt } from "react-icons/fa";
import { IoIosTime } from "react-icons/io";
import { TbMoodEmptyFilled } from "react-icons/tb";
import { ideaPublicDataType } from "../lib/ideaDataType/ideaType";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";

export default function PublicIdeas() {

    const divRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [aiComparision, setAiComparision] = useState<boolean>(false);
    const [comparisionModal, setComparisionModal] = useState<boolean>(false);

    const [data, setData] = useState<{ id: string, content: string }[]>([]);
    const [query, setQuery] = useState<{ heading: string, category: string }>({ heading: '', category: '' });

    const { data: ideaData, isPending: fetchLoading, isFetching, refetch } = useQuery({
        queryKey: ['public-ideas'], // ✅ Refetches when query changes if you pass query
        queryFn: async () => {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/idea/public`,
                { params: query }
            );
            const data: ResponseType = response.data;
            return data.data; // Return just data
        },
        staleTime: 10 * 60 * 1000, // 10 min cache [web:1]
        gcTime: 30 * 60 * 1000, // 30 min garbage collection [web:1]
    });

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

    const handleDownloadImage = useCallback((id: string) => {
        const ref = divRefs.current[id];
        if (!ref) return;

        toPng(ref, { cacheBust: true })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `idea-${id}.png`;
                link.href = dataUrl;
                link.click();
            })
    }, []);


    return (
        <>
            <main className="w-full line-bg bg-no-repeat bg-top min-h-screen px-3 md:px-5 lg:px-10">
                <div className="w-full py-16 md:py-28 2xl:py-32">
                    <h2 className="text-3xl font-bold text-(--dark-color) text-center">🌍Public Ideas</h2>

                    <div className="w-full mt-5 flex justify-center items-center flex-wrap gap-2 sm:gap-4">
                        <input
                            disabled={aiComparision || fetchLoading || isFetching}
                            value={query.heading} onChange={(e) => setQuery((prev) => ({ ...prev, heading: e.target.value }))}
                            className="w-[45%] sm:w-[30%] xl:w-[18%] bg-white border border-slate-300 p-1.5 rounded-md" placeholder="Search by Heading" type="search" name="title" id="title" />
                        <input
                            disabled={aiComparision || fetchLoading || isFetching}
                            value={query.category} onChange={(e) => setQuery((prev) => ({ ...prev, category: e.target.value }))}
                            className="w-[45%] sm:w-[30%] xl:w-[18%] bg-white border border-slate-300 p-1.5 rounded-md" placeholder="Search by Category" type="search" name="category" id="category" />
                        <button
                            disabled={aiComparision || fetchLoading || isFetching}
                            onClick={() => refetch()}
                            className={`w-[98%] sm:w-[30%] xl:w-[18%] py-1.5 px-3 font-semibold text-white rounded-md ${(aiComparision || fetchLoading || isFetching) ? 'bg-(--dark-color)/50 cursor-not-allowed' : 'bg-(--dark-color) cursor-pointer'}`}>
                            {fetchLoading || isFetching ? '...' : 'Search'}
                        </button>

                        <div className="w-auto xl:w-[18%] text-sm sm:text-[16px] flex items-center gap-1 font-semibold">
                            ✨ AI Comparision
                            <input
                                disabled={fetchLoading || isFetching}
                                checked={aiComparision} onChange={(e) => setAiComparision(e.target.checked)} type="checkbox" name="ai" id="ai" />
                        </div>
                        {aiComparision &&
                            <button
                                disabled={fetchLoading || isFetching || data?.length !== 2}
                                onClick={() => setComparisionModal(true)}
                                className={`w-[45%] sm:w-auto xl:w-[18%] py-1.5 px-3 text-sm sm:text-[16px] font-semibold text-white rounded-md ${(fetchLoading || data?.length !== 2) ? 'bg-(--dark-color)/50 cursor-not-allowed' : 'bg-(--dark-color) cursor-pointer'}`}>✨ Compare</button>
                        }
                    </div>

                    {
                        !fetchLoading && !isFetching && ideaData?.length === 0 && (
                            <div className="w-full py-20 flex flex-col justify-center items-center gap-5">
                                <p className="text-slate-700"><TbMoodEmptyFilled size={200} /></p>
                                <p className="text-center text-slate-700">Oops! No Data. Try to Create One.</p>
                            </div>
                        )
                    }

                    {
                        (fetchLoading || isFetching) && (
                            <div className="w-full py-20 flex justify-center items-center">
                                <div className="loader"></div>
                            </div>
                        )
                    }

                    {!fetchLoading && !isFetching && ideaData?.length > 0 &&
                        <div className="w-full mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {
                                ideaData?.map((ele: ideaPublicDataType) => (
                                    <div
                                        ref={(el) => { divRefs.current[ele._id] = el; }}
                                        key={ele._id}
                                        className="p-2 animate__animated animate__zoomIn self-start border relative border-(--light-color) bg-[rgb(255,210,249)] rounded-md">

                                        <p className="text-xl text-(--dark-color) font-bold">{ele.heading}</p>
                                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{ele.content}</p>
                                        <div className="w-full flex justify-start items-center gap-5">
                                            <p className="bg-white border border-slate-300 py-1 px-3 text-sm rounded-full">{ele.category}</p>
                                            <button onClick={()=> handleDownloadImage(ele._id)} title="Download as Image" className="text-xl hover:text-(--dark-color) cursor-pointer"><FaFileImage /></button>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 text-sm mt-2">
                                            <p className="flex items-center gap-1"><IoIosTime /> {ele.createdAt.split('T')[0]}</p>
                                            <p className="flex items-center gap-1"><FaPencilAlt /> {ele.updatedAt.split('T')[0]}</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-800 mt-2">
                                            Published by {ele.authorId.name} <Image className="w-5 h-5 rounded-full bg-white border border-slate-800" src={ele.authorId.image} alt={ele.authorId.name} width={20} height={20} />
                                        </div>

                                        {aiComparision &&
                                            <input className="w-7 h-7 absolute right-0 top-0" type="checkbox"
                                                onChange={(e) => handleAddIdea(ele._id, ele.content)}
                                                checked={checkExist(ele._id)} />
                                        }

                                    </div>
                                ))
                            }
                        </div>
                    }

                </div>
            </main>

            <ComparisionIdeaModal data={data} comparisionModal={comparisionModal} setComparisionModal={setComparisionModal} />
        </>
    )
};