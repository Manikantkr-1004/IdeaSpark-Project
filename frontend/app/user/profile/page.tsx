'use client';

import { LoginHistoryType, ProfileDataType } from "@/app/lib/userDataType/userType";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FaDatabase, FaKey, FaPen } from "react-icons/fa";
import { IoIosTime } from "react-icons/io";
import { MdEmail } from "react-icons/md";

let IndOption: any = {
    timeZone: "Asia/Kolkata",
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
};

export default function UserProfile() {

    const { data: session } = useSession();

    const { data: userData, isPending, isFetching } = useQuery<ProfileDataType>({
        queryKey: ['user-profile', session?.user.accessToken],
        queryFn: async () => {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`
                    }
                }
            );
            return response.data.data; // Return ProfileDataType
        },
        enabled: !!session, // Wait for session (your if (!session) return)
        staleTime: 10 * 60 * 1000, // 10min cache
        gcTime: 20 * 60 * 1000, // 20 min for garbage throw
    });



    return (
        <main className="w-full line-bg bg-no-repeat bg-top min-h-screen px-3 md:px-5 lg:px-10">

            {
                (isPending || isFetching) && (
                    <div className="w-full min-h-screen flex justify-center items-center">
                        <div className="loader"></div>
                    </div>
                )
            }

            {!isPending && !isFetching &&
                <div className="w-full py-16 md:py-28 2xl:py-32">
                    <div className="w-36 h-3w-36 m-auto border-3 border-(--dark-color) rounded-full overflow-hidden">
                        {userData?.image && <Image className="bg-(--light-color) w-full h-full object-cover" src={userData?.image} alt={userData?.name ?? 'user'} width={200} height={200} />}
                    </div>
                    <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 mt-5">
                        <div className="p-2 border border-(--dark-color) min-w-40 w-full sm:w-auto bg-slate-50 rounded-md">
                            <p className="text-(--dark-color) font-semibold flex items-center gap-2"><FaPen /> Full Name</p>
                            <p className="text-sm">{userData?.name}</p>
                        </div>
                        <div className="p-2 border border-(--dark-color) min-w-40 w-full sm:w-auto bg-slate-50 rounded-md">
                            <p className="text-(--dark-color) font-semibold flex items-center gap-2"><MdEmail size={21} /> Email Id</p>
                            <p className="text-sm">{userData?.email}</p>
                        </div>
                    </div>
                    <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
                        <div className="p-2 border border-(--dark-color) min-w-40 w-full sm:w-auto bg-slate-50 rounded-md">
                            <p className="text-(--dark-color) font-semibold flex items-center gap-2"><FaDatabase /> Unique Id</p>
                            <p className="text-sm">{userData?._id}</p>
                        </div>
                        <div className="p-2 border border-(--dark-color) min-w-40 w-full sm:w-auto bg-slate-50 rounded-md">
                            <p className="text-(--dark-color) font-semibold flex items-center gap-2"><IoIosTime size={21} /> Account Created</p>
                            {userData && <p className="text-sm">{new Date(userData?.createdAt).toLocaleString('en-In', IndOption)}</p>}
                        </div>
                    </div>
                    <div className="w-full my-4 flex flex-wrap justify-center items-center gap-2">
                        <Link className="p-2 w-full sm:w-auto rounded-md bg-(--dark-color) text-white font-semibold" href={'/user/ideas'}>Generate Ideas by AI ✨</Link>
                        <Link className="p-2 w-full sm:w-auto rounded-md bg-(--dark-color) text-white font-semibold" href={'/user/ideas'}>Manage Your Ideas 🏬</Link>
                        <Link className="p-2 w-full sm:w-auto rounded-md bg-slate-50 border border-slate-400 font-semibold" href={'/ideas'}>Explore Public Ideas 🌍</Link>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <p className="border-2 border-(--dark-color) bg-(--dark-color)/80 ring-2 ring-(--dark-color)/40 text-white mt-4 p-2 rounded-md font-semibold flex items-center gap-2"><FaKey /> Login History</p>
                        <div className="w-full flex flex-wrap items-center gap-3">
                            {
                                userData?.loginHistory?.map((ele: LoginHistoryType) => (
                                    <div key={ele._id} className="w-full sm:w-auto border border-slate-400 p-2 rounded-md text-sm text-center">
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Image src={`https://authjs.dev/img/providers/${ele.provider !== 'credentials' ? ele.provider : 'auth0'}.svg`} alt={ele.provider} width={24} height={24} />
                                            <span>LoggedIn via {ele.provider.toUpperCase()} </span>
                                        </div>
                                        <p>{new Date(ele.date).toLocaleString('en-In', IndOption)}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            }
        </main>
    )
}