'use client';

import { UserContext } from "@/app/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { FaPen } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function UserProfile () {

    const {user} = useContext(UserContext);

    return (
        <main className="w-full line-bg bg-no-repeat bg-top min-h-screen px-3 md:px-5 lg:px-10">
            <div className="w-full py-16 md:py-28 2xl:py-32">
                <div className="w-36 h-3w-36 m-auto border-3 border-(--dark-color) rounded-full overflow-hidden">
                    {user?.profileImg && <Image className="bg-(--light-color) w-full h-full object-cover" src={user?.profileImg} alt={user?.name} width={200} height={200} />}
                </div>
                <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 mt-5">
                    <div className="p-2 border border-(--dark-color) min-w-40 w-full sm:w-auto bg-slate-50 rounded-md">
                        <p className="text-(--dark-color) font-semibold flex items-center gap-2"><FaPen /> Your Name</p>
                        <p className="text-sm">{user?.name}</p>
                    </div>
                    <div className="p-2 border border-(--dark-color) min-w-40 w-full sm:w-auto bg-slate-50 rounded-md">
                        <p className="text-(--dark-color) font-semibold flex items-center gap-2"><MdEmail size={21} /> Your Email</p>
                        <p className="text-sm">{user?.email}</p>
                    </div>
                </div>
                <div className="w-full mt-4 flex flex-col justify-center items-center gap-2">
                    <Link className="p-2 rounded-md bg-(--dark-color) text-white font-semibold" href={'/user/ideas'}>Generate Ideas by AI ✨</Link>
                    <Link className="p-2 rounded-md bg-(--dark-color) text-white font-semibold" href={'/user/ideas'}>Manage Your Ideas 🏬</Link>
                    <Link className="p-2 rounded-md bg-slate-50 border border-slate-400 font-semibold" href={'/ideas'}>Explore Public Ideas 🌍</Link>
                </div>
            </div>
        </main>
    )
}