import connectToDatabase from "@/app/lib/db";
import Adsbrand from "@/models/Adsbrand";
import { NextResponse } from "next/server";
import {join} from "path";
import {writeFile} from "fs/promises";

export const GET = async () => {
    await connectToDatabase();
    try {
        const adsBrands = await Adsbrand.find().limit(2);
        return NextResponse.json(adsBrands, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'مشگلی در دریافت برندهای تبلیغاتی رخ داده است'}, {status: 500});
    }
}

// ******************************************************************************

export const POST = async (request) => {
    const data = await request.formData();

    //recieve and validate image:
    const file = data.get('image');

    if (!file) {
        return NextResponse.json({success: false, message: "آپلود تصویر الزامیست"}, {status: 400});
    }

    const url = data.get('url');

    if(!url || typeof url !== 'string' || url.trim() === ""){
        return new NextResponse(JSON.stringify({message: "فیلد لینک الزامی میباشد"}), {status: 400});
    }

    // برای آپلود فایل، حتما باید آن را به بافر تبدیل کنیم:
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), '/public/uploads');
    const filePath = join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    try {
        await connectToDatabase();
        const adsbrand = await Adsbrand.create({
            imageUrl: `/uploads/${file.name}`,
            url: url
        });
        return new NextResponse(JSON.stringify(adsbrand), {status: 201});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}