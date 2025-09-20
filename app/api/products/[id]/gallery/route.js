import connectToDatabase from "@/app/lib/db";
import Gallery from "@/models/Gallery";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import {join} from "path";
import {writeFile} from "fs/promises";

export const GET = async (request, {params}) => {
    const {id} = await params;

    try {
        await connectToDatabase();
        const productImages = await Gallery.find({product: id}).populate({ path: 'product', model: Product });
        
        return new NextResponse(JSON.stringify(productImages), {status: 200});    
    } catch (error) {
        return new NextResponse('خطا در اتصال به دیتابیس', {status: 500});
    }
}

export const POST = async (request) => {
    
    // recieve request:
    const data = await request.formData();
    
    // recieve and validate image:
    const file = data.get('image');
    if(!file){
        return NextResponse.json({success: false, message: "آپلود تصویر الزامیست"});
    }

    // recieve other fields:
    const product = data.get('product');

    // validate other fields:
    if(!product){
        return new NextResponse(JSON.stringify({message: "تمامی فیلدها الزامی میباشد"}), {status: 400});
    }

    // برای آپلود فایل، حتما باید آن را به بافر تبدیل کنیم:
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    //حالا میخواهیم مسیر ذخیره سازی فایل را تعیین کنیم:
    const uploadDir = join(process.cwd(), "public/uploads");
    // آدرس عکس:
    const filePath = join(uploadDir, file.name);
    // حالا باید عکس را به آدرس بالا منتقل کنیم:
    await writeFile(filePath, buffer);

    try {
        await connectToDatabase();
        const productImage = await Gallery.create({
            product,
            imageUrl: `/uploads/${file.name}`
        });
        return new NextResponse(JSON.stringify(productImage), {status: 201});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}
