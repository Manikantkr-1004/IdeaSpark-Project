'use client';
import Image from "next/image";
import { useEffect, useState } from "react";

const texts = [
    'Generate Your Raw Thoughts into Good Ideas by AI',
    'Compare two ideas and choose best One by AI',
    'Store and Share your Ideas with Others here',
    'Download your favourite Ideas as Image'
];

export default function HomeCompany() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % 4);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="w-full px-3 md:px-5 lg:px-10 py-10 pb-32 sm:pb-0">
            <div className="w-full fixed-max-width m-auto relative">
                <h2 className="text-3xl font-bold mb-12 lg:mb-20 m-auto underline-heading text-(--dark-color)">🚀 Launch Idea 🚀</h2>
                <p className="text-center text-blue-600 text-shadow-lg font-bold text-4xl lg:text-5xl -z-1 absolute left-1/2 top-[84%] -translate-x-1/2 w-full">
                    {texts[index]}
                </p>
                <Image
                    className={`w-full z-1 sm:w-125 m-auto hue-rotate-${(index+1)*90}`}
                    src={'/persons_idea_generating.png'}
                    width={500}
                    height={350}
                    alt="Generating Ideas by Lady"
                />
            </div>
        </section>
    );
}
