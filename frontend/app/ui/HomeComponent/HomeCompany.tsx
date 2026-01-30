import Image from "next/image";


export default function HomeCompany() {
    return (
        <section className="w-full px-3 md:px-5 lg:px-10 py-6">
            <div className="w-full fixed-max-width m-auto">
                <h2 className="text-3xl font-bold mb-8 lg:mb-20 m-auto underline-heading text-(--dark-color)">🚀 Launch Idea 🚀</h2>

                <div className="w-full flex flex-col md:flex-row gap-5 justify-between items-center">
                    <div className="w-full md:w-1/2 flex justify-center items-center border-none border-r-2 lg:border-dashed border-(--dark-color)/60">
                        <Image className="hue-rotate-90" src={'/persons_idea_generating.png'} width={500} height={350} alt="Generating Ideas by Lady" />
                    </div>
                    <div className="w-full md:w-1/2 flex justify-end relative">
                        <p className="absolute top-1/2 -translate-y-1/2 left-[30%] md:left-[30%] lg:left-[45%] rotate-45 animate-bounce text-4xl lg:text-5xl">☝️</p>
                        <p className="absolute text-shadow-md top-1/2 -translate-y-1/2 -left-42.5 sm:-left-[20%] md:-left-[50%] lg:-left-[25%] xl:-left-[10%] w-110 -rotate-90 text-yellow-300 text-center font-bold text-4xl lg:text-5xl">Generate Your Raw Thoughts into</p>
                        <Image className="brightness-105 w-40 lg:w-auto" src={'/idea-tip.gif'} width={200} height={500} alt="Idea Tip" />
                    </div>
                </div>

            </div>
        </section>
    )
}