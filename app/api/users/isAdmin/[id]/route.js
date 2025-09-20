import connectToDatabase from "@/app/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const PUT = async (request, {params}) => {
    const {id} = await params;
    if(!id){
        return NextResponse.json({success: false, message: 'شناسه کاربر معتبر نیست'}, {status: 404});
    }

    try {
        await connectToDatabase();
        const user = await User.findById(id);
        const newUser = await User.findByIdAndUpdate(id, {isAdmin: !user.isAdmin}, {new: true});
        if(newUser.isAdmin === true){
            return new NextResponse(JSON.stringify({message: 'کاربر با موفقیت به ادمین تغییر یافت'}), {status: 200});
        }else{
            return new NextResponse(JSON.stringify({message: 'کاربر با موفقیت به کاربر عادی تغییر یافت'}), {status: 200});
        }
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}