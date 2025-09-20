import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export const PUT = async (request, {params}) => {
    const {id} = await params;
    if(!id){
        return NextResponse.json({success: false, message: 'شناسه محصول معتبر نیست'}, {status: 404});
    }

    const {stock} = await request.json();

    //************************************** */ backend validation***************************************
    if(!stock || isNaN(stock)){
        return new NextResponse(JSON.stringify({message: "موجودی محصول الزامیست"}), {status: 400});
    }else if(stock < 0){
        return new NextResponse(JSON.stringify({message: "موجودی محصول نباید کمتر از صفر باشد"}), {status: 400});
    }
    //************************************** */ backend validation***************************************

    try {
        await connectToDatabase();
        const newProduct = await Product.findByIdAndUpdate(id, {stock: stock}, {new: true});
        return new NextResponse(JSON.stringify({message: `موجودی ${newProduct.name} با موفقیت به روز رسانی شد`}), {status: 200});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}