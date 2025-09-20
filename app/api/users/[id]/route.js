import connectToDatabase from "@/app/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    const {id} = await params;
    if(!id){
        return NextResponse.json({success: false, message: 'شناسه کاربر معتبر نیست'}, {status: 404});
    }
    try {
        await connectToDatabase();
        const user = await User.findById(id);
        return new NextResponse(JSON.stringify(user), {status: 200});
    } catch (error) {
        return new NextResponse('خطا در اتصال به دیتابیس', {status: 500});
    }
}

export async function PUT(request, {params}) {
    const {id} = await params;
    if(!id){
        return NextResponse.json({success: false, message: 'شناسه کاربر معتبر نیست'}, {status: 404});
    }
    const {name, mobile, email, isAdmin} = await request.json();
   
    //*************************************start backend validation**************************************
    if (!name || typeof name !== "string" || name.trim() === "") {
        return new NextResponse(JSON.stringify({message: 'نام کاربر الزامی می باشد'}), {status: 400});
    }

    if (name.length < 3 || name.length > 30) {
        return new NextResponse(JSON.stringify({message: 'نام کاربر بین 3 تا 30 کاراکتر میباشد'}), {status: 400});
    }

    const mobilePattern = /^(\+98|98|0)9\d{9}$/;

    if (!mobile) {
        return new NextResponse(JSON.stringify({message: "موبایل کاربر الزامیست"}), {status: 400});
    }else if (!mobilePattern.test(mobile)) {
        return new NextResponse(JSON.stringify({message: "موبایل کاربر معتبر نمی باشد"}), {status: 400});
    }

    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;
    
    if(email && !emailPattern.test(email)){
        return new NextResponse(JSON.stringify({message: "ایمیل کاربر نامعتبر است"}), {status: 400});
    }

    if (typeof isAdmin != 'boolean' ) {
        return new NextResponse(JSON.stringify({message: "وضعیت ادمین نامعتبر است"}), {status: 400});
    }

    //*************************************end backend validation**************************************

    try {
        await connectToDatabase();
        if(email){
            const newUser = await User.findByIdAndUpdate(id, {name, mobile, email, isAdmin}, {new: true});
        }else{
            const newUser = await User.findByIdAndUpdate(id, {name: name, mobile: mobile, email: null, isAdmin: isAdmin}, {new: true});
        }
        return new NextResponse(JSON.stringify({message: 'کاربر با موفقیت ویرایش شد'}), {status: 200});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
    
}

// *****************************************************************************************************
export const DELETE = async (request, {params}) => {
    const {id} = await params;
    if(!id){
        return NextResponse.json({success: false, message: 'شناسه کاربر معتبر نیست'}, {status: 404});
    }
    try {
        await connectToDatabase();
        await User.findByIdAndDelete(id);
        return new NextResponse(JSON.stringify({message: 'کاربر با موفقیت حذف شد'}), {status: 200});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}