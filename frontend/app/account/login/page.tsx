import { Suspense } from "react";
import LoginClient from "@/app/ui/LoginComponent/LoginClient";
import { Loader } from "@/app/ui/loader";



export default function AccountLogin() {

    return (
        <Suspense fallback={<Loader />}>
            <LoginClient />
        </Suspense>
    )
}