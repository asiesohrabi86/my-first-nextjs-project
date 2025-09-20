import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request, {params}) => {
    const {id} = await params;
    try {
        await connectToDatabase();
        const category = await Category.findById(id);
        if (!category) {
            return new NextResponse(JSON.stringify({message: 'دسته بندی پیدا نشد'}), {status: 404});
        }
        return new NextResponse(JSON.stringify(category), {status: 200});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}

export const PUT = async (request, {params}) => {
    const {id} = await params;
    const body = await request.json();
    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
        return new NextResponse(JSON.stringify({message: ""}, {status: 400}));
    }

    if (body.name.length < 3 || body.name.length > 30) {
        return new NextResponse(JSON.stringify({message: ""}, {status: 400}));
    }

    try {
        await connectToDatabase();
        const newCategory = await Category.findByIdAndUpdate(id, body, {new: true});
        return new NextResponse(JSON.stringify(newCategory), {status: 200});

    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}

export const DELETE = async (request, {params}) => {
    const {id} = await params;
    try {
        await connectToDatabase();
        await Category.findByIdAndDelete(id);
        return new NextResponse(JSON.stringify({message: 'دسته بندی با موفقیت حذف شد'}), {status: 204});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}

