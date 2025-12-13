'use client';
import { emailValidate } from "@/app/lib/emailValidation";
import { ResponseType, SignupDataType } from "@/app/lib/userDataType/userType";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

const initialData: SignupDataType = {
    name: '',
    email: '',
    password: '',
    secret: ''
}
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AccountRegister () {

    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData((prev)=> ({...prev, [name]: value}));
    }

    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!emailValidate(formData.email)){
            return toast.error('Invalid email');
        }

        try {
            setLoading(true);
            const response = await axios.post(`${BACKEND_API}/user/signup`, formData);
            const data: ResponseType = response.data;
            toast.success(data?.message || 'Signup Successfull');
            router.replace('/account/login');
            
        } catch (error: any) {
            console.log('Error in register account', error);
            toast.error(error?.response?.data?.message || 'Internal Server Error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="w-full px-3 md:px-5 lg:px-10 py-16 md:py-28 2xl:py-32">
            <h2 className="text-2xl font-bold mb-10 text-(--dark-color) m-auto underline-heading">👤Create Account👤</h2>

            <form onSubmit={handleSubmit} className="w-full animate__animated animate__fadeInUp md:w-80 shadow-none sm:shadow-lg border border-slate-400 p-3 rounded-lg m-auto flex flex-col gap-5">

                <label className="flex flex-col gap-1">
                    Enter Name*
                    <input value={formData.name} onChange={handleChange} className="w-full border p-1 rounded-md" type="text" minLength={3} name="name" id="name" required />
                </label>

                <label className="flex flex-col gap-1">
                    Enter Email*
                    <input value={formData.email} onChange={handleChange} className="w-full border p-1 rounded-md" type="email" name="email" id="email" required />
                </label>

                <label className="flex flex-col gap-1">
                    Enter Password*
                    <input value={formData.password} onChange={handleChange} className="w-full border p-1 rounded-md" type="password" minLength={8} name="password" id="password" required />
                </label>

                <label className="flex flex-col gap-1">
                    Enter Secret*
                    <input value={formData.secret} onChange={handleChange} className="w-full border p-1 rounded-md" type="text" minLength={8} name="secret" id="secret" required />
                    <p className="text-xs">Secret will be used to reset password, incase if you forget your password.</p>
                </label>

                <button 
                disabled={loading}
                className={`w-full ${loading ? 'cursor-not-allowed bg-(--dark-color)/50' : 'bg-(--dark-color) cursor-pointer'} text-white rounded-md font-bold py-2`} type="submit">
                    {loading ? <FaSpinner className="animate-spin m-auto" /> : 'Signup'}
                </button>

                <p className="text-xs text-center">Already Account? <Link className="text-(--light-color)" href={'/account/login'}>Login now</Link></p>

            </form>
        </main>
    )
}