import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    
    // Protect admin routes on the server side
    if (pathname.includes('/admin') && !pathname.includes('/admin/login')) {
        const token = req.cookies.get('adminToken')?.value;
        if (!token) {
            // Find the locale from the pathname or fallback to default 'en'
            const localeMatch = pathname.match(/^\/([a-z]{2})\/admin/);
            const locale = localeMatch ? localeMatch[1] : 'en';
            
            const loginUrl = new URL(`/${locale}/admin/login`, req.url);
            return NextResponse.redirect(loginUrl);
        }
    }
    
    return intlMiddleware(req);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
