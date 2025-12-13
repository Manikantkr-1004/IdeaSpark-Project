'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '@/app/context/UserContext';
import 'animate.css';

export default function HomeTop() {

    const {user} = useContext(UserContext);

    return (
        <section className='w-full home-bg bg-no-repeat bg-cover bg-fixed px-3 md:px-5 lg:px-10'>
            <div className="fixed-max-width relative m-auto text-center py-16 md:py-28 2xl:py-32 flex flex-col items-center gap-10">
                {user.isLoggedIn && <p className='text-yellow-400 font-semibold animate-pulse -mb-4 lg:-mb-8 text-center'>👋 <span className="text-white">Welcome,</span> {user.name}</p>}
                <h1 className="text-4xl md:text-6xl lg:text-7xl text-bg font-bold pb-1.5 text-white animate__animated animate__zoomInDown">
                    Transform Raw Thoughts Into Meaningful Ideas
                </h1>

                <p className="text-white/80 text-lg md:text-xl max-w-2xl animate__animated animate__slideInDown">
                    Organize private notes, share public innovations, and let AI assist your creative workflow—all in one simple, powerful platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Link href="/user/ideas" className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:opacity-80 animate__animated animate__fadeInLeft">
                        Generate Idea ⚡
                    </Link>
                    <Link href="/ideas" className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 animate__animated animate__fadeInRight">
                        Explore Public Ideas 🌍
                    </Link>
                </div>

                <p className="absolute animate-pulse bottom-1/3 sm:bottom-1/4 left-0 xl:left-1/7 text-4xl sm:text-8xl rotate-12">💡</p>
                <p className="absolute animate-pulse bottom-[60%] sm:bottom-1/4 right-0 xl:right-1/7 text-5xl sm:text-8xl -rotate-12">✨</p>
            </div>
        </section>
    )
}