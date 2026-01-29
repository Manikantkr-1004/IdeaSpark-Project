'use client';
import { emailValidate } from "@/app/lib/emailValidation";
import { ResetPasswordDataType, ResponseType } from "@/app/lib/userDataType/userType";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

const initialData: ResetPasswordDataType = {
    email: '',
    newPassword: '',
    secret: ''
}

export default function AccountResetPassword() {

    const [formData, setFormData] = useState(initialData);
    const router = useRouter();

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData: ResetPasswordDataType) => {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/forgot-password`,
                formData
            );
            return response.data;
        },
        onSuccess: (data: ResponseType) => {
            toast.success(data?.message || 'Password Reset Successful');
            router.replace('/account/login');
        },
        onError: (error: any) => {
            console.error('Error in reset password account', error);
            toast.error(error?.response?.data?.message || 'Internal Server Error');
        },
    })

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!emailValidate(formData.email)) {
            return toast.error('Invalid email');
        }

        mutate(formData);
    }

    return (
        <main className="w-full px-3 md:px-5 lg:px-10 py-16 md:py-28 2xl:py-32">
            <h2 className="text-2xl font-bold mb-10 text-(--dark-color) m-auto underline-heading">🔑Reset Password🔑</h2>

            <form onSubmit={handleSubmit} className="w-full animate__animated animate__fadeInUp md:w-80 shadow-none sm:shadow-lg border border-slate-400 p-3 rounded-lg m-auto flex flex-col gap-5">

                <label className="flex flex-col gap-1">
                    Enter Email*
                    <input value={formData.email} onChange={handleChange} className="w-full border p-1 rounded-md" type="email" name="email" id="email" required />
                </label>

                <label className="flex flex-col gap-1">
                    Enter Secret*
                    <input value={formData.secret} onChange={handleChange} className="w-full border p-1 rounded-md" type="text" minLength={8} name="secret" id="secret" required />
                    <p className="text-xs">In case, you haven't set password & secret till now, secret is your email.</p>
                </label>

                <label className="flex flex-col gap-1">
                    Enter New Password*
                    <input value={formData.newPassword} onChange={handleChange} className="w-full border p-1 rounded-md" type="password" minLength={8} name="newPassword" id="newPassword" required />
                </label>

                <button
                    disabled={isPending}
                    className={`w-full ${isPending ? 'cursor-not-allowed bg-(--dark-color)/50' : 'bg-(--dark-color) cursor-pointer'} text-white rounded-md font-bold py-2`} type="submit">
                    {isPending ? <FaSpinner className="animate-spin m-auto" /> : 'Reset Password'}
                </button>

                <p className="text-xs text-center">Have Password? <Link className="text-(--light-color)" href={'/account/login'}>Login now</Link></p>

            </form>
        </main>
    )
}