"use client";
import Link from 'next/link';
import { TbMoodEmptyFilled } from 'react-icons/tb';

export default function Error({error, reset}: {
    error: Error & {digest?: string},
    reset: () => void 
}) {

    return (

        <div className='w-full line-bg bg-no-repeat bg-top bg-white min-h-screen py-6 flex flex-col justify-center items-center gap-5 px-3'>
            <p className="text-slate-700"><TbMoodEmptyFilled size={200} /></p>
            <p className="text-[1.2rem] font-bold text-center">Something Went Wrong</p>
            <p className="font-normal text-center">{error.message || 'An Error Occurred'}</p>
            <Link className="w-48 py-2 rounded-md bg-(--dark-color) text-white font-semibold text-center" href='/'>Go to Homepage</Link>
            <button onClick={()=> reset()} className='w-48 py-2 rounded-md bg-slate-700 cursor-pointer text-white font-semibold'>Try to Reset</button>
        </div>
    );
};