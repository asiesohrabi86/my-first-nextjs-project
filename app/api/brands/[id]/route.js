import connectToDatabase from "@/app/lib/db";
import Brand from "@/models/Brand";
import { NextResponse } from "next/server";
import {join} from "path";
import {writeFile, unlink} from "fs/promises";


export async function GET(request, {params}){
    const {id} = await params;
    if(!id){
        return NextResponse.json({message: 'شناسه معتبر نیست'}, {status: 400}); 
    }

    try{
        await connectToDatabase();
        const brand = await Brand.findById(id);
        if(!brand){
            return NextResponse.json({message: 'شناسه معتبر نیست'}, {status: 400}); 
        }

        return NextResponse.json(brand, {status: 200}); 

    }catch(error){
        return NextResponse.json({message: error.message}, {status: 500});
    }
}

// **************************************************************************

export async function PUT(request, {params}){
    const {id} = await params;
    
    if(!id){
        return NextResponse.json({message: 'شناسه معتبر نیست'}, {status: 404}); 
    }

    const data = await request.formData();
    const file = data.get('image');
    const name = data.get('name');

    if(!name || typeof name !== 'string' || name.trim() === ""){
        return NextResponse.json({message: 'نام برند الزامیست'}, {status: 400}); 
    }

    try{
        await connectToDatabase();
        const brand = await Brand.findById(id);
        if(!brand){
            return NextResponse.json({message: 'برند معتبر نیست'}, {status: 400}); 
        }

        let imageUrl = brand.imageUrl;

        if(file && file.name){
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadsDir = join(process.cwd(), "public/uploads");
            const filePath = join(uploadsDir, file.name);

            imageUrl = `/uploads/${file.name}`;

            await writeFile(filePath, buffer);

            const oldFilePath = join(process.cwd(), "public", brand.imageUrl);

            await unlink(oldFilePath).catch(() => {
                console.log('خطا در حذف تصویر قبلی');
            });
        }

         const updatedBrand = await Brand.findByIdAndUpdate(id, {
            imageUrl,
            name
         }, {new: true});

         return NextResponse.json(updatedBrand, {status: 200});

    }catch(error){
        return NextResponse.json({message: 'خطا در ویرایش برند'}, {status: 500});
    }
}

// **************************************************************************

export async function DELETE(request, {params}){
    const {id} = await params;
    
    if(!id){
        return NextResponse.json({message: 'شناسه معتبر نیست'}, {status: 404}); 
    }

    try{
        await connectToDatabase();
        const brand = await Brand.findById(id);
        if(!brand){
            return NextResponse.json({message: 'برند معتبر نیست'}, {status: 400}); 
        }

        const oldFilePath = join(process.cwd(), "public", brand.imageUrl);
        await unlink(oldFilePath).catch(() => {
            console.log('خطا در حذف تصویر ');
        });

        await Brand.findOneAndDelete({_id: id});
        return new NextResponse(JSON.stringify({message: 'برند با موفقیت حذف شد'}), {status: 200});

    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}