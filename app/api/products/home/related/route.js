import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
    const {searchParams} = new URL(request.url);
    const categoryId = searchParams.get('category');

    if (!categoryId) {
        return NextResponse.json({error: 'categoryId not found'}, {status: 400});
    }
    await connectToDatabase();
    try {
        const relatedProducts = await Product.find({category : categoryId}).limit(8).select("name price imageUrl");
        if (!relatedProducts) {
            return NextResponse.json({error: 'product not found'}, {status: 400});
        }
        return NextResponse.json(relatedProducts, {status: 200});
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}