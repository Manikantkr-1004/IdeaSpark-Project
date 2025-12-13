'use client';
import { ReactNode, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { Loader } from "../ui/loader";

const noneAuthPaths: string[] = [
    '/account/login',
    '/account/signup',
    '/account/reset-password'
];

const authPaths: string[] = [
    '/user/profile',
    '/user/ideas'
]

export function ProtectRoutes({ children }: { children: ReactNode }) {

    const { user } = useContext(UserContext);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if(user.authLoading) return;
        
        if (user.isLoggedIn && noneAuthPaths.includes(pathname)) {
            return router.replace('/')
        }

        if (!user.isLoggedIn && authPaths.includes(pathname)) {
            return router.replace(`/account/login?redirectTo=${pathname}`)
        }
    }, [user.isLoggedIn, pathname]);

    if(user.authLoading){
        return <Loader />
    }

    return children;
}