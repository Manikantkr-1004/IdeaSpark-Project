'use client';
import { UserContext } from "@/app/context/UserContext";
import { emailValidate } from "@/app/lib/emailValidation";
import { LoginDataType, ResponseType } from "@/app/lib/userDataType/userType";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

const initialData: LoginDataType = {
    email: '',
    password: '',
}

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function LoginClient() {

    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState<boolean>(false);
    const { handleLogin } = useContext(UserContext);

    const router = useRouter();
    const searchParams = useSearchParams();
    const navigate = searchParams.get("redirectTo");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!emailValidate(formData.email)) {
            return toast.error('Invalid email');
        }

        try {
            setLoading(true);
            const response = await axios.post(`${BACKEND_API}/user/login`, formData);
            const data: ResponseType = response.data;
            toast.success(`Welcome Back, ${data?.data?.name}` || 'Signup Successfull');
            handleLogin({...data?.data, isLoggedIn: true})
            router.replace(navigate ? `${navigate}` : '/');
            
        } catch (error: any) {
            console.log('Error in register account', error);
            toast.error(error?.response?.data?.message || 'Internal Server Error')
        } finally {
            setLoading(false)
        }
    }    

    return (
        <main className="w-full px-3 md:px-5 lg:px-10 py-16 md:py-28 2xl:py-32">
            <h2 className="text-2xl font-bold mb-10 text-(--dark-color) m-auto underline-heading">🔐Login Account🔐</h2>

            <form onSubmit={handleSubmit} className="w-full animate__animated animate__fadeInUp md:w-80 shadow-none sm:shadow-lg border border-slate-400 p-3 rounded-lg m-auto flex flex-col gap-5">

                <label className="flex flex-col gap-1">
                    Enter Email*
                    <input value={formData.email} onChange={handleChange} className="w-full border p-1 rounded-md" type="email" name="email" id="email" required />
                </label>

                <label className="flex flex-col gap-1">
                    Enter Password*
                    <input value={formData.password} onChange={handleChange} className="w-full border p-1 rounded-md" type="password" minLength={8} name="password" id="password" required />
                    <Link className="text-(--light-color) text-xs text-right" href={'/account/reset-password'}>Forgot Password?</Link>
                </label>

                <button
                    disabled={loading}
                    className={`w-full ${loading ? 'cursor-not-allowed bg-(--dark-color)/50' : 'bg-(--dark-color) cursor-pointer'} text-white rounded-md font-bold py-2`} type="submit">
                    {loading ? <FaSpinner className="animate-spin m-auto" /> : 'Login'}
                </button>

                <p className="text-xs text-center">Have not account? <Link className="text-(--light-color)" href={'/account/register'}>Register now</Link></p>

            </form>
        </main>
    )
}