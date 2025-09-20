import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import {join} from "path";
import {writeFile} from "fs/promises";

export const GET = async () => {
    try {
        await connectToDatabase();
        const products = await Product.find({}).populate({ path: 'category', model: Category });
        return new NextResponse(JSON.stringify(products), {status: 200});
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
    const name = data.get('name');
    const description = data.get('description');
    const price = data.get('price');
    const stock = data.get('stock');
    const category = data.get('category');

    // validate other fields:
    if(!name || !description || isNaN(price) || isNaN(stock) || !category){
        return new NextResponse(JSON.stringify({message: "تمامی فیلدها الزامی میباشد"}), {status: 400});
    }

    if(typeof name !== 'string' || name.trim() === ""){
        return new NextResponse(JSON.stringify({message: "فیلد نام الزامی میباشد"}), {status: 400});
    }

    if (name.length < 3 || name.length > 30) {
        return new NextResponse(JSON.stringify({message: "نام محصول بین  3 تا 30 کاراکتر میباشد"}), {status: 400});
    }

    if(typeof description !== 'string' || description.trim() === ""){
        return new NextResponse(JSON.stringify({message: "فیلد توضیحات الزامی میباشد"}), {status: 400});
    }

    if (description.length < 3 || description.length > 500) {
        return new NextResponse(JSON.stringify({message: "توضیحات محصول بین  3 تا 500 کاراکتر میباشد"}), {status: 400});
    }

    if (price <= 0) {
        return new NextResponse(JSON.stringify({message: "قیمت محصول باید یک مقدار مثبت باشد"}), {status: 400});
    }

    if (stock < 0) {
        return new NextResponse(JSON.stringify({message: "موجودی محصول باید یک مقدار مثبت باشد"}), {status: 400});
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
        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            imageUrl: `/uploads/${file.name}`
        });
        return new NextResponse(JSON.stringify(product), {status: 201});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}
