import connectToDatabase from "@/app/lib/db";
import Gallery from "@/models/Gallery";
import { NextResponse } from "next/server";
import {join} from "path";
import {writeFile, unlink} from "fs/promises";


export const GET = async (request, {params}) => {
    const {id, productImageId} = await params;
    console.log(productImageId);
    
    try {
        await connectToDatabase();
        const productImage = await Gallery.findById(productImageId);
        if(!productImage){
            return new NextResponse(JSON.stringify({message: 'تصویر محصول پیدا نشد '}), {status: 404});
        }
        return new NextResponse(JSON.stringify(productImage), {status: 200});

    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
    
}

export const PUT = async (request, {params}) => {
    const {id, productImageId} = await params;
    if(!productImageId){
        return NextResponse.json({success: false, message: 'شناسه تصویر محصول معتبر نیست'}, {status: 404});
    }
    const data = await request.formData();
    // recieve and validate image:
    const file = data.get('image');

    // recieve other fields:
    const product = data.get('product');

    // validate other fields:
    if(!product){
        return new NextResponse(JSON.stringify({message: "تمامی فیلدها الزامی میباشد"}), {status: 400});
    }


    try {
        await connectToDatabase();
        const productImage = await Gallery.findById(productImageId);
        if(!productImage){
            return NextResponse.json({success: false, message: 'تصویر محصول معتبر نیست'}, {status: 404});
        }
        
        // بدست آوردن عکس قبلی
        let imageUrl = productImage.imageUrl;

        if(file && file.name){
            // باید عکس جدید را آپلود کنیم:
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadsDir = join(process.cwd(), "public/uploads");
            const filePath = join(uploadsDir, file.name);

            await writeFile(filePath, buffer);
            imageUrl = `/uploads/${file.name}`;

            // عکس قبلی را باید پاک کنیم:
            const oldFilePath = join(process.cwd(), "public", productImage.imageUrl);
            await unlink(oldFilePath).catch(() => {
                console.log('خطا در حذف تصویر قبلی');
                
            });
        }
        const updatedProductImage = await Gallery.findByIdAndUpdate(productImageId, {
           imageUrl,
           product
        }, {new: true});
        return new NextResponse(JSON.stringify(updatedProductImage), {status: 200});

    } catch (error) {
        return NextResponse.json({success: false, message: 'خطا در ویرایش تصویر محصول'}, {status: 500});
    }
}

export const DELETE = async (request, {params}) => {
    const {id, productImageId} = await params;
    if(!productImageId){
        return NextResponse.json({success: false, message: 'شناسه تصویر محصول معتبر نیست'}, {status: 404});
    }
    try {
        await connectToDatabase();
        const productImage = await Gallery.findById(productImageId);
        if(!productImage){
            return NextResponse.json({success: false, message: 'تصویر محصول معتبر نیست'}, {status: 404});
        }
        
        const filePath = join(process.cwd(), "public", productImage.imageUrl);
        await unlink(filePath).catch(() => {
            console.log('خطا در حذف تصویر');
            
        });
        await Gallery.findOneAndDelete({_id: productImageId});
        // await Gallery.findByIdAndDelete(id);
        return new NextResponse(JSON.stringify({message: 'تصویر محصول با موفقیت حذف شد'}), {status: 200});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}