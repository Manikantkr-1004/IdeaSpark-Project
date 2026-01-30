import Image from "next/image";

interface AboutReview {
    name: string;
    review: string;
    rating: number;
}

const reviewsData: AboutReview[] = [
    {
        name: "Alice Johnson",
        review: "This platform has revolutionized the way I organize my ideas. The AI features are incredibly helpful!",
        rating: 5,
    },
    {
        name: "Mark Thompson",
        review: "A must-have tool for anyone looking to boost their creativity and productivity. Highly recommended!",
        rating: 2,
    },
    {
        name: "Sophie Lee",
        review: "The user interface is clean and intuitive. I love how easy it is to categorize and filter my ideas.",
        rating: 4,
    },
    {
        name: "Ramu Kumar",
        review: "This platform has revolutionized the way I organize my ideas. The AI features are incredibly helpful!",
        rating: 1,
    },
    {
        name: "Shyam Singh",
        review: "A must-have tool for anyone looking to boost their creativity and productivity. Highly recommended!",
        rating: 3,
    },
    {
        name: "Rohit Kumar",
        review: "The user interface is clean and intuitive. I love how easy it is to categorize and filter my ideas.",
        rating: 4,
    },
    {
        name: "Nikki Kumari",
        review: "This platform has revolutionized the way I organize my ideas. The AI features are incredibly helpful!",
        rating: 5,
    },
    {
        name: "Mark Singh",
        review: "A must-have tool for anyone looking to boost their creativity and productivity. Highly recommended!",
        rating: 2,
    },
    {
        name: "Nykaa Lee",
        review: "The user interface is clean and intuitive. I love how easy it is to categorize and filter my ideas.",
        rating: 4,
    },
    {
        name: "Alice John",
        review: "This platform has revolutionized the way I organize my ideas. The AI features are incredibly helpful!",
        rating: 5,
    }
]

export default function HomeReviews() {
    return (
        <>
        <div className="-mb-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 210"><path fill="#571e5f" fillOpacity="1" d="M0,192L1440,96L1440,320L0,320Z"></path></svg>
        </div>
        <section className='w-full bg-(--dark-color) px-3 md:px-5 lg:px-10'>
            <div className="fixed-max-width m-auto py-8 md:py-14 2xl:py-16">
                <h2 className="text-3xl font-bold mb-10 text-center text-white">⭐ Public Reviews ⭐</h2>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        reviewsData.map((item,ind)=> (
                            <div key={ind} className="border border-(--light-color)/70 bg-(--light-color)/20 p-2 rounded-md flex flex-col justify-center items-center gap-2 duration-200 delay-200 ease-linear hover:-rotate-12">
                                <Image className="w-25 h-25 rounded-full bg-white" src={`https://robohash.org/${item.name}.svg`} alt={item.name} width={100} height={100} />
                                <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                                <p className="text-white text-center max-w-xs">{item.review}</p>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, index) => (
                                        <span key={index} className={`text-xl ${index < item.rating ? "text-yellow-400" : "text-white"}`}>
                                            &#9733;
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>
        </section>
        <div className="-mt-1 rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 210"><path fill="#571e5f" fillOpacity="1" d="M0,192L1440,96L1440,320L0,320Z"></path></svg>
        </div>
        </>
    )
}