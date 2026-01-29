import { auth } from './auth';
import { NextResponse } from 'next/server';

const nonProtectedRoutes = ['/account/login', '/account/register', '/account/reset-password'];

export default auth((request)=> {

    const { nextUrl } = request;
    const pathname = nextUrl.pathname;

    const isNoneAuthRoute = nonProtectedRoutes.includes(pathname);

    const isLoggedIn = !!request?.auth;

    // Prevent logged in users from accessing login/signup pages
    if(isLoggedIn && isNoneAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Protect all protected routes
    if(!isLoggedIn && !isNoneAuthRoute) {
        const loginUrl = new URL('/account/login', request.url);
        loginUrl.searchParams.set('redirectTo', encodeURI(pathname));
        return NextResponse.redirect(loginUrl);
    }

    // Allow all other routes
    return NextResponse.next()

});

// Specify the paths where the middleware should be applied
export const config = {
    matcher: [
        '/user/:path*',
        '/account/:path*'
    ]
}