import connectToDatabase from "@/app/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import Otp from "@/models/Otp";
import User from "@/models/User";
import {sendSms} from "@/app/lib/melipayamak"


export const POST =async (request) => {
    await connectToDatabase();

    try {
        const {name, phone, type} = await request.json();
        
        if (!type || !['register', 'login'].includes(type)) {
            return new NextResponse(JSON.stringify({message: "نوع درخواست نامعتبر است"}), {status: 400});
        }

        // general validation
        const phoneRegex = /^(\+98|0)9\d{9}$/;
        if (!phone || !phoneRegex.test(phone)) {
            return new NextResponse(JSON.stringify({message: "شماره موبایل معتبر نیست"}), {status: 400});
        }


        if (type === 'register') {
            //special register validation
            if (!name || name.trim().length < 3 || name.trim().length > 30) {
                return new NextResponse(JSON.stringify({message: "نام و نام خانوادگی باید بین 3 تا 30 کاراکتر باشد"}), {status: 400});
            }

         // نباید بگذاریم کاربر تکراری در دیتابیس ایجاد شود، باوجود اینکه در دیتابیس فیلد را یونیک کردیم
            const existingUser = await User.findOne({phone});
            if (existingUser) {
                return new NextResponse(JSON.stringify({message: "کاربر با این شماره تلفن قبلا ثبت نام کرده است"}), {status: 400});
            }
        }
        else if(type === 'login'){
            const user = await User.findOne({phone});
            if (!user) {
                return new NextResponse(JSON.stringify({message: "کاربری با این شماره ثبت نام نکرده است"}), {status: 400}); 
            }
            console.log(user);
            
        }

        // create otp
        const otpCode = crypto.randomInt(100000, 999999).toString();
        console.log(otpCode);

        const otp = Otp.create({
            phone: phone,
            code: otpCode,
            kind: type === 'register' ? 1 : 2,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        // send sms otp code
        await sendSms(phone, `کد تایید شما: ${otpCode}`);

        return new NextResponse(JSON.stringify({message: "کد تایید برای شما ارسال شد"}), {status: 200});

    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
    

}