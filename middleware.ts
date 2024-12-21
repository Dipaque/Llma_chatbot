import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const email = request.cookies.get("email")?.value;
    const userName = request.cookies.get("userName")?.value;
    const photoURL = request.cookies.get("photoURL")?.value;

    if(request.nextUrl.pathname === '/' ){
        return NextResponse.redirect(new URL('/login', request.url));
    }

}