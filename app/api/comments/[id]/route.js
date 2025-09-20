import connectToDatabase from "@/app/lib/db";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";

export const PUT = async (request, {params}) => {
    const {id} = await params;
    if(!id){
        return NextResponse.json({success: false, message: 'شناسه نظر معتبر نیست'}, {status: 404});
    }

    try {
        await connectToDatabase();
        const comment = await Comment.findById(id);
        const newComment = await Comment.findByIdAndUpdate(id, {isConfirmed: !comment.isConfirmed}, {new: true});
        if(newComment.isConfirmed === true){
            return new NextResponse(JSON.stringify({message: 'نظر با موفقیت تایید شد'}), {status: 200});
        }else{
            return new NextResponse(JSON.stringify({message: 'نظر با موفقیت به عدم تایید تغییر یافت'}), {status: 200});
        }
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}

export const DELETE = async (request, {params}) => {
    const {id} = await params;
    if(!id){
        return NextResponse.json({success: false, message: 'شناسه نظر معتبر نیست'}, {status: 404});
    }
    try {
        await connectToDatabase();
        await Comment.findByIdAndDelete(id);
        return new NextResponse(JSON.stringify({message: 'نظر با موفقیت حذف شد'}), {status: 200});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}