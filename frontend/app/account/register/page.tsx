'use client';
import { emailValidate } from "@/app/lib/emailValidation";
import { ResponseType, SignupDataType } from "@/app/lib/userDataType/userType";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";
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

export default function AccountRegister() {

    const [formData, setFormData] = useState(initialData);
    const router = useRouter();

    const { mutate, isPending } = useMutation({
        mutationFn: async (newData: SignupDataType) => {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signup`,
                newData
            );
            return response.data;
        },
        onSuccess: (data: ResponseType) => {
            toast.success(data?.message || 'Signup Successful');
            router.replace('/account/login');
        },
        onError: (error: any) => {
            console.error('Error in register account', error);
            toast.error(error?.response?.data?.message || 'Internal Server Error');
        },
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!emailValidate(formData.email)) {
            return toast.error('Invalid email');
        }

        // 2. Trigger the Mutation
        mutate(formData);
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
                    disabled={isPending}
                    className={`w-full ${isPending ? 'cursor-not-allowed bg-(--dark-color)/50' : 'bg-(--dark-color) cursor-pointer'} text-white rounded-md font-bold py-2`} type="submit">
                    {isPending ? <FaSpinner className="animate-spin m-auto" /> : 'Signup'}
                </button>

                <div className="w-full flex justify-between items-center">
                    <span className="w-[45%] h-px bg-slate-300"></span>
                    <p className="text-sm">or</p>
                    <span className="w-[45%] h-px bg-slate-300"></span>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <button onClick={() => signIn('google')} type="button" className="w-full border border-slate-700 bg-white hover:bg-(--dark-color) hover:text-white rounded-md font-semibold text-sm py-2 cursor-pointer"><Image src="https://authjs.dev/img/providers/google.svg" alt="Google" width={20} height={20} className="inline mr-2" /> Continue with Google</button>
                    <button onClick={() => signIn('github')} type="button" className="w-full border border-slate-700 bg-white hover:bg-(--dark-color) hover:text-white rounded-md font-semibold text-sm py-2 cursor-pointer"><Image src="https://authjs.dev/img/providers/github.svg" alt="Github" width={20} height={20} className="inline mr-2" /> Continue with Github</button>
                </div>

                <p className="text-xs text-center">Already Account? <Link className="text-(--light-color)" href={'/account/login'}>Login now</Link></p>

            </form>
        </main>
    )
}