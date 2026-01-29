'use client';

import { ResponseType } from '@/app/lib/userDataType/userType';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

interface ComparisionType {
    id: string,
    content: string
}

interface CreateIdeaModalProps {
    data: ComparisionType[]
    comparisionModal: boolean;
    setComparisionModal: Dispatch<SetStateAction<boolean>>;
}

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ComparisionIdeaModal({ data, comparisionModal, setComparisionModal }: CreateIdeaModalProps) {
    
    const [formData, setFormData] = useState<ComparisionType[]>(data);
    const [response, setResponse] = useState<string>('');

    useEffect(() => {
        setFormData(data);
    }, [data]);

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData: ComparisionType[]) => {
            const response = await axios.post(`${BACKEND_API}/idea/suggest`, {ideas: [formData[0].content, formData[1].content]});
            return response.data;
        },
        onSuccess: (data: ResponseType) => {
            toast.success(data?.message || 'AI suggested Successfully'); 
            setResponse(data?.data);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Internal Server Error')
        }
    })

    const handleChange = (id: string, value: string) => {
        const newData= formData.map((ele: ComparisionType)=> ele.id===id ? ({...ele, content: value}): ele);
        setFormData(newData)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        mutate(formData);
    }

    if(!comparisionModal) return null;

    return (
        <>
            <div className={`fixed inset-0 bg-opacity-60 backdrop-blur-sm z-9999`} />

            <div className={`fixed inset-0 flex items-center justify-center z-9999`}>

                {/* Modal Card */}
                <div className="bg-white p-4 rounded-xl shadow-2xl w-[98%] max-h-screen sm:max-h-[90%] sm:h-auto sm:max-w-100 lg:max-w-150 border border-slate-300 overflow-y-auto">

                    <h2 className="text-lg text-(--dark-color) text-center font-semibold">✨ Compare Idea by AI</h2>

                    {/* Modal Body */}
                    <form onSubmit={handleSubmit} className='w-full h-full mt-3 flex flex-col gap-3'>

                        <label className="flex flex-col gap-1">
                            <span className="font-medium">1st Idea*</span>
                            <textarea 
                            disabled={isPending} 
                            value={formData[0]?.content} onChange={(e)=> handleChange(formData[0].id, e.target.value)} 
                            placeholder='If i start this business...' minLength={10} className="w-full min-h-30 border p-1 rounded-md" required />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="font-medium">2nd Idea*</span>
                            <textarea 
                            disabled={isPending} 
                            value={formData[1]?.content} onChange={(e)=> handleChange(formData[1].id, e.target.value)} 
                            placeholder='Coffee shop is better i think...' minLength={10} className="w-full min-h-30 border p-1 rounded-md" required />
                        </label>

                        {response && !isPending &&
                            <div className="flex flex-col gap-1">
                            <p className='font-semibold text-(--dark-color)'>✨ AI Suggested</p>
                            <p className='text-slate-700 whitespace-pre-wrap'>{response}</p>
                        </div>}

                        <button 
                        disabled={isPending}
                        className={`w-full py-1.5 ${isPending? 'bg-(--dark-color)/50 cursor-not-allowed':'bg-(--dark-color) cursor-pointer'} rounded-md text-white font-semibold`} type="submit">
                            {isPending ? <FaSpinner className='animate-spin m-auto my-1' /> : (response ? 'Compare Again' : 'Compare')}
                        </button>

                        <button 
                        disabled={isPending}
                        onClick={()=> setComparisionModal((prev)=> !prev)}
                        className={`w-full py-1.5 ${isPending ? 'bg-red-500/50 cursor-not-allowed': 'bg-red-500 cursor-pointer'} rounded-md text-white font-semibold`} type="button">Cancel</button>

                    </form>

                </div>
            </div>
        </>
    );
}
