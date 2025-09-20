import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    const {id} = await params;
    await connectToDatabase();

    try {
        if (!id || id.length !== 24) {
            return NextResponse.json({error: "invalid product ID"}, {status: 400});
        }
        const product = await Product.findById(id).populate({ path: 'category', model: Category })
        .select("name description price imageUrl category stock views");

        if (!product) {
            return NextResponse.json({error: "product not found"}, {status: 404});
        }

        return NextResponse.json(product, {status: 200});

    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}