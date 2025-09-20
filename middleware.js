import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    //   ابتدا باید توکن را دریافت کنیم چون موقعی که کاربر لاگین میکند،
    //  اطلاعات او را درون توکن ذخیره میکنیم و حالا میتوانیم از روی توکن فیلد ایزادمین کاربر را بخوانیم
    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

    // اگر توکن وجود نداشته باشد، یعنی کاربر لاگین نکرده و باید به صفحه لاگین برود
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (!token.isAdmin) {
        return NextResponse.redirect(new URL("/unauthorize", req.url));
    }

    // کاربر ادمین است و باید میدلور بعدی چک شود
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};