import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaUserCircle } from "react-icons/fa";

export default function Footer() {

    const currentYear = new Date().getFullYear();

    return (
        <>
        <div className="-mb-1">
        <svg width="100%" height="100%" id="svg" viewBox="0 0 1440 250" xmlns="http://www.w3.org/2000/svg" className="transition duration-300 ease-in-out delay-150">
            <path d="M 0,400 L 0,150 C 212,187 424,224 664,224 C 904,224 1172,187 1440,150 L 1440,400 L 0,400 Z" stroke="none" strokeWidth="0" fill="#571e5f" fillOpacity="1" className="transition-all duration-300 ease-in-out delay-150 path-0"></path>
        </svg>
        </div>
        <footer className="w-full bg-(--dark-color) px-3 md:px-5 py-5">
            <div className="w-full flex flex-col md:flex-row justify-between items-start gap-5 pt-5 lg:pt-0">
                <div className="flex flex-col items-center md:items-start gap-2 w-full lg:w-1/3 md:w-1/2">
                    <Link href={'/'}>
                        <Image className="w-40 md:w-50 rounded-md" src={'/logo.png'} alt="logo" width={200} height={40} />
                    </Link>
                    <p className="text-white text-center md:text-left">IdeaSpark is a platform to share and discover innovative ideas. Create account to get ideas from AI too. People can compare 2 ideas by AI and get best one. Are you ready to innovate?</p>
                </div>
                <div className="w-full lg:w-1/3 md:w-1/2 flex flex-col justify-center items-start md:items-center">
                    <h2 className="text-(--light-color) flex items-center gap-1 font-semibold text-lg mb-2"><FaUserCircle size={20} /> Built By</h2>
                    <ul className="text-white">
                        <li>Manikant Kumar</li><br />
                        <li className="flex justify-start md:justify-center items-center gap-3">
                            <Link className="hover:text-(--light-color)" href={'https://github.com/manikantkr-1004'} target="_blank" rel="noopener noreferrer">
                                <FaGithub size={24} />
                            </Link>
                            <Link className="hover:text-(--light-color)" href={'https://www.linkedin.com/in/manikantofficial2023'} target="_blank" rel="noopener noreferrer">
                                <FaLinkedin size={24} />
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="w-full lg:w-1/3 md:w-1/2">
                    <h2 className="text-(--light-color) flex items-center gap-1 font-semibold text-lg mb-2">Explore Links</h2>
                    <ul className="flex flex-col gap-1">
                        <li>
                            <Link className="text-white hover:text-(--light-color)" href={'/'}>Home</Link>
                        </li>
                        <li>
                            <Link className="text-white hover:text-(--light-color)" href={'/ideas'}>Ideas</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <hr className="my-6 text-(--light-color)/50" />
            <p className="text-center text-white text-sm">&copy; {currentYear} IdeaSpark. All rights reserved.</p>
        </footer>
        </>
    )
}