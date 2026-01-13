'use client';

import { UserContext } from '@/app/context/UserContext';
import { createIdeaType } from '@/app/lib/ideaDataType/ideaType';
import { ResponseType } from '@/app/lib/userDataType/userType';
import axios from 'axios';
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

interface CreateIdeaModalProps {
    createModal: boolean;
    setCreateModal: Dispatch<SetStateAction<boolean>>;
}

const initialData: createIdeaType = {
    heading: '',
    content: '',
    category: '',
    visibility: 'private',
    isAi: false
}
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CreateIdeaModal({ createModal, setCreateModal }: CreateIdeaModalProps) {

    if (!createModal) return null;

    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState<boolean>(false);
    const {user} = useContext(UserContext);

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setFormData((prev)=> ({...prev, [name]: value}));
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setLoading(true);
            const response = await axios.post(`${BACKEND_API}/idea/create`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            });
            const data: ResponseType = response.data;
            toast.success(data?.message || 'Idea Created Successfull');
            setCreateModal(false);
            
        } catch (error: any) {
            console.log('Error in create idea', error);
            toast.error(error?.response?.data?.message || 'Internal Server Error')
        } finally {
            setLoading(false)
        }
    }
    

    return (
        <>
            <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm z-9999" />

            <div className="fixed inset-0 flex items-center justify-center z-9999">

                {/* Modal Card */}
                <div className="bg-white p-4 rounded-xl shadow-2xl w-[98%] max-h-screen sm:max-h-[90%] sm:max-w-100 border border-slate-300 overflow-y-auto">

                    <h2 className="text-lg text-(--dark-color) text-center font-semibold">✨ Create/Generate New Idea</h2>

                    {/* Modal Body */}
                    <form onSubmit={handleSubmit} className='w-full h-full mt-3 flex flex-col gap-3'>

                        <label className="flex items-center gap-1 text-sm font-semibold text-(--light-color)">
                            💡 Generate by AI <input disabled={loading} checked={formData.isAi} onChange={(e)=> setFormData((prev)=> ({...prev, isAi: e.target.checked}))} type="checkbox" name="isAi" id="isAi" />
                        </label>

                        {!formData.isAi &&
                            <label className="flex flex-col gap-1">
                            <span className="font-medium">Enter Heading*</span>
                            <input disabled={loading} value={formData.heading} onChange={handleChange} placeholder='My Startup Idea' minLength={3} className="w-full border p-1 rounded-md" type="text" name="heading" id="heading" required />
                        </label>}

                        <label className="flex flex-col gap-1">
                            <span className="font-medium">{formData.isAi ? 'Enter Raw Thoughts*': 'Enter Content*'}</span>
                            <textarea disabled={loading} value={formData.content} onChange={handleChange} placeholder='How I can start...' minLength={10} className="w-full border p-1 rounded-md" name="content" id="content" required />
                        </label>

                        {!formData.isAi &&
                            <label className="flex flex-col gap-1">
                            <span className="font-medium">Enter Category*</span>
                            <input disabled={loading} value={formData.category} onChange={handleChange} placeholder='Startup' minLength={2} className="w-full border p-1 rounded-md" type="text" name="category" id="category" required />
                        </label>}

                        {!formData.isAi &&
                            <label className="flex flex-col gap-1">
                            <span className="font-medium">Select Visibility*</span>
                            <select disabled={loading} value={formData.visibility} onChange={handleChange} name='visibility' id='visibility' className="w-full border p-1 rounded-md" required >
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </select>
                        </label>}

                        <button 
                        disabled={loading}
                        className={`w-full py-1.5 ${loading? 'bg-(--dark-color)/50 cursor-not-allowed':'bg-(--dark-color) cursor-pointer'} rounded-md text-white font-semibold`} type="submit">
                            {loading ? <FaSpinner className='animate-spin m-auto my-1' /> : (formData.isAi ? '✨Generate by AI':'Create')}
                        </button>

                        <button 
                        disabled={loading}
                        onClick={()=> setCreateModal((prev)=> !prev)}
                        className={`w-full py-1.5 ${loading ? 'bg-red-500/50 cursor-not-allowed': 'bg-red-500 cursor-pointer'} rounded-md text-white font-semibold`} type="button">Cancel</button>

                    </form>

                </div>
            </div>
        </>
    );
}
