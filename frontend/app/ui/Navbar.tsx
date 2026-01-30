'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { signOut, useSession } from "next-auth/react"

export default function Navbar() {

    const { data: session, status } = useSession();
    const user = session?.user ;

    const [openBox, setOpenBox] = useState<boolean>(false);
    const [profileBox, setProfileBox] = useState<boolean>(false);

    return (
        <header className="w-full shadow flex justify-between items-center gap-5 py-2 px-2 md:px-5 sticky top-0 z-999 bg-white">
            <Link href={'/'}>
                <Image className="w-44 md:w-50" src={'/logo.png'} alt="logo" width={200} height={40} priority />
            </Link>
            <nav className="flex justify-between items-center gap-4 md:gap-5 text-(--dark-color) font-medium">
                <Link className="hidden md:block hover:text-(--light-color)" href={'/ideas'}>Ideas</Link>
                {
                    !session && (
                        <>
                            <Link className="hidden md:block hover:text-(--light-color)" href={'/account/login'}>Login</Link>
                            <Link className="hidden md:block hover:text-(--light-color)" href={'/account/register'}>Register</Link>
                            <button className="cursor-pointer hover:text-(--light-color) md:hidden relative" onClick={() => setOpenBox(!openBox)}>
                                <CiMenuKebab size={24} />
                                {openBox &&
                                    <div className="absolute top-8 right-2 w-30 p-2 bg-white text-(--dark-color) rounded-md flex flex-col justify-start items-start gap-2 border border-slate-300">
                                        <Link className="w-full text-left hover:text-(--light-color)" href={'/account/login'}>Login</Link>
                                        <Link className="w-full text-left hover:text-(--light-color)" href={'/account/register'}>Register</Link>
                                        <Link className="w-full text-left hover:text-(--light-color)" href={'/ideas'}>Public Ideas</Link>
                                    </div>}
                            </button>
                        </>
                    )
                }
                {
                    session && (
                        <>
                            <Link className="hidden md:block hover:text-(--light-color)" href={'/user/ideas'}>My Ideas</Link>
                            <Link className="hidden md:block hover:text-(--light-color)" href={'/user/profile'}>Profile</Link>
                            <button title={user?.name ?? "User"} className="relative cursor-pointer" onClick={()=> setProfileBox(!profileBox)}>
                                <div className="w-8.5 h-8.5 overflow-hidden rounded-full hover:text-(--light-color) border-2 hover:border-(--light-color) border-(--dark-color)">
                                    {user?.image && <Image className="w-full h-full object-cover" src={user?.image} alt="user-icon" width={30} height={30} />}
                                </div>
                                {profileBox &&
                                    <div className="absolute top-10 right-2 w-30 p-2 bg-white text-(--dark-color) rounded-md flex flex-col justify-start items-start gap-2 border border-slate-300">
                                        <p className="text-sm w-full truncate">{user?.name}</p>
                                        <p className="text-xs w-full truncate">{user?.email}</p>
                                        <Link className="md:hidden w-full text-left hover:text-(--light-color)" href={'/user/profile'}>Profile</Link>
                                        <Link className="md:hidden w-full text-left hover:text-(--light-color)" href={'/user/ideas'}>My Ideas</Link>
                                        <Link className="md:hidden w-full text-left hover:text-(--light-color)" href={'/ideas'}>Public Ideas</Link>
                                        <div onClick={()=> signOut()} className="w-full rounded-md bg-red-500 text-white text-sm py-1.5 cursor-pointer">Logout</div>
                                    </div>}
                            </button>
                        </>
                    )
                }

            </nav>
        </header>
    )
}