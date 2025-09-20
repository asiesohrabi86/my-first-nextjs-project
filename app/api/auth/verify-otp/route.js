import connectToDatabase from "@/app/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    console.log('hi server');
    
    const {phone, code, name} = await request.json();

    // validation
    if (!name || !phone || !code) {
        return new NextResponse(JSON.stringify({message: 'پر کردن تمام فیلدها الزامیست'}), {status: 400});
    }

    try {
        await connectToDatabase();
        const otp = await Otp.findOne({phone, code});
        if (!otp) {
            return new NextResponse(JSON.stringify({message: 'کد واردشده صحیح نمیباشد'}), {status: 400});
        }
        
        if(otp.expiresAt < new Date()){
            return new NextResponse(JSON.stringify({message: 'کد منقضی شده است'}), {status: 400});
        }

        // create user
        const user = await User.create({
            name, 
            phone,
            isAdmin: false,
            isActive: true
        });

        // // دیگر به کد ساخته شده نیازی نداریم
        await Otp.deleteOne({code});
        return new NextResponse(JSON.stringify({message: "ثبت نام با موفقیت انجام شد"}), {status: 201});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
    
}