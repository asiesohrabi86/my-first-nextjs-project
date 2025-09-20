import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDatabase();

    try {
        const featuredProducts = await Product.find().sort({views: -1}).limit(8)
        .select("name price imageUrl category views");
        return NextResponse.json(featuredProducts, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'مشگلی در دریافت محصولات پربازدید رخ داده است'}, {status: 500});
    }
}