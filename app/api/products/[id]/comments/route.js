import Comment from "@/models/Comment";
import User from "@/models/User";
import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";

export const GET = async (request, {params}) => {
    const {id} = await params;
    console.log(id);
    
    try {
        await connectToDatabase();
        const comments = await Comment.find({productId: id, isConfirmed: true}).populate({ path: 'userId', model: User });
        console.log(comments);
        return new NextResponse(JSON.stringify(comments), {status: 200});
    } catch (error) {
        return new NextResponse('خطا در اتصال به دیتابیس', {status: 500});
    }
}