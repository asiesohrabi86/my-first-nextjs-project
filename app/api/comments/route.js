import connectToDatabase from "@/app/lib/db"
import { NextResponse } from "next/server";
import Comment from "@/models/Comment";
import Product from "@/models/Product";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";

export const GET = async (params) => {
    try {
        await connectToDatabase();
        const comments = await Comment.find().populate({ path: 'userId', model: User }).populate({ path: 'productId', model: Product });
        return new NextResponse(JSON.stringify(comments), {status: 200});
    } catch (error) {
        return new NextResponse('خطا در اتصال به دیتابیس', {status: 500});
    }
}

// *********************************************************************************************

export async function POST(req) {
    const {productId, comment} = await req.json();
   
    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET}); 
    const userId = token._id;
    console.log(userId);

    //backend validation
    if (!userId || userId.length != 24) {
        return new NextResponse(JSON.stringify({message: 'کاربر ثبت نام نکرده یا وارد سایت نشده است'}), {status: 400});
    }

    if (!productId || productId.length != 24) {
        return new NextResponse(JSON.stringify({message: 'اطلاعات کامل نیست'}), {status: 400});
    }

    if (!comment || typeof comment !== "string" || comment.trim() === "") {
        return new NextResponse(JSON.stringify({message: 'نظر الزامی می باشد'}), {status: 400});
    }

    if (comment.length < 3 || comment.length > 300) {
        return new NextResponse(JSON.stringify({message: 'نظر بین 3 تا 300 کاراکتر میباشد'}), {status: 400});
    }

    try{
        await connectToDatabase();
        console.log('ok');
        const newComment = await Comment.create({
            userId,
            comment,
            productId,
        });

        return new NextResponse(JSON.stringify(newComment), {status: 201});

    }catch(error){
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
    
}


