import connectToDatabase from "@/app/lib/db";
import Adsbrand from "@/models/Adsbrand";
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
        const adsBrand = await Adsbrand.findById(id);
        if(!adsBrand){
            return NextResponse.json({message: 'شناسه معتبر نیست'}, {status: 400}); 
        }

        return NextResponse.json(adsBrand, {status: 200}); 

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
    const url = data.get('url');

    if(!url || typeof url !== 'string' || url.trim() === ""){
        return NextResponse.json({message: 'لینک برند تبلیغاتی الزامیست'}, {status: 400}); 
    }

    try{
        await connectToDatabase();
        const adsBrand = await Adsbrand.findById(id);
        if(!adsBrand){
            return NextResponse.json({message: 'برند تبلیغاتی معتبر نیست'}, {status: 400}); 
        }

        let imageUrl = adsBrand.imageUrl;

        if(file && file.name){
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadsDir = join(process.cwd(), "public/uploads");
            const filePath = join(uploadsDir, file.name);

            imageUrl = `/uploads/${file.name}`;

            await writeFile(filePath, buffer);

            const oldFilePath = join(process.cwd(), "public", adsBrand.imageUrl);

            await unlink(oldFilePath).catch(() => {
                console.log('خطا در حذف تصویر قبلی');
            });
        }

         const updatedAdsBrand = await Adsbrand.findByIdAndUpdate(id, {
            imageUrl,
            url
         }, {new: true});

         return NextResponse.json(updatedAdsBrand, {status: 200});

    }catch(error){
        return NextResponse.json({message: 'خطا در ویرایش برند تبلیغاتی'}, {status: 500});
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
        const adsBrand = await Adsbrand.findById(id);
        if(!adsBrand){
            return NextResponse.json({message: 'برند تبلیغاتی معتبر نیست'}, {status: 400}); 
        }

        const oldFilePath = join(process.cwd(), "public", adsBrand.imageUrl);
        await unlink(oldFilePath).catch(() => {
            console.log('خطا در حذف تصویر ');
        });

        await Adsbrand.findOneAndDelete({_id: id});
        return new NextResponse(JSON.stringify({message: 'برند تبلیغاتی با موفقیت حذف شد'}), {status: 200});

    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}