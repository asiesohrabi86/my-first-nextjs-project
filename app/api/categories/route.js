import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectToDatabase();
        const categories = await Category.find();
        return new NextResponse(JSON.stringify(categories), {status: 200});
    } catch (error) {
        return new NextResponse('خطا در اتصال به دیتابیس', {status: 500});
    }
}

export async function POST(request) {
    const body = await request.json();
   
    //backend validation
    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
        return new NextResponse(JSON.stringify({message: 'نام دسته بندی الزامی می باشد'}), {status: 400});
    }

    if (body.name.length < 3 || body.name.length > 30) {
        return new NextResponse(JSON.stringify({message: 'نام دسته بندی بین 3 تا 30 کاراکتر میباشد'}), {status: 400});
    }

    try {
        await connectToDatabase();
        const category = await Category.create(body);
        return new NextResponse(JSON.stringify(category), {status: 201});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
    
}