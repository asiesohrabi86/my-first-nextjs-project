import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import {join} from "path";
import {writeFile, unlink} from "fs/promises";


export const GET = async (request, {params}) => {
    const {id} = await params;
    try {
        await connectToDatabase();
        const product = await Product.findById(id);
        if(!product){
            return new NextResponse(JSON.stringify({message: 'محصول پیدا نشد'}), {status: 404});
        }
        return new NextResponse(JSON.stringify(product), {status: 200});

    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
    
}

export const PUT = async (request, {params}) => {
    const {id} = await params;
    if(!id){
        return NextResponse.json({success: false, message: 'شناسه محصول معتبر نیست'}, {status: 404});
    }
    const data = await request.formData();
    // recieve and validate image:
    const file = data.get('image');

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


    try {
        await connectToDatabase();
        const product = await Product.findById(id);
        if(!product){
            return NextResponse.json({success: false, message: 'محصول معتبر نیست'}, {status: 404});
        }
        
        // بدست آوردن عکس قبلی
        let imageUrl = product.imageUrl;

        if(file && file.name){
            // باید عکس جدید را آپلود کنیم:
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadsDir = join(process.cwd(), "public/uploads");
            const filePath = join(uploadsDir, file.name);

            await writeFile(filePath, buffer);
            imageUrl = `/uploads/${file.name}`;

            // عکس قبلی را باید پاک کنیم:
            const oldFilePath = join(process.cwd(), "public", product.imageUrl);
            await unlink(oldFilePath).catch(() => {
                console.log('خطا در حذف تصویر قبلی');
                
            });
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, {
           name,
           description,
           price,
           stock,
           imageUrl,
           category
        }, {new: true});
        return new NextResponse(JSON.stringify(updatedProduct), {status: 200});

    } catch (error) {
        return NextResponse.json({success: false, message: 'خطا در ویرایش محصول'}, {status: 500});
    }
}

export const DELETE = async (request, {params}) => {
    const {id} = await params;
    if(!id){
        return NextResponse.json({success: false, message: 'شناسه محصول معتبر نیست'}, {status: 404});
    }
    try {
        await connectToDatabase();
        const product = await Product.findById(id);
        if(!product){
            return NextResponse.json({success: false, message: 'محصول معتبر نیست'}, {status: 404});
        }
        
        const filePath = join(process.cwd(), "public", product.imageUrl);
        await unlink(filePath).catch(() => {
            console.log('خطا در حذف تصویر');
            
        });
        await Product.findOneAndDelete({_id: id});
        // await Product.findByIdAndDelete(id);
        return new NextResponse(JSON.stringify({message: 'محصول با موفقیت حذف شد'}), {status: 204});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}