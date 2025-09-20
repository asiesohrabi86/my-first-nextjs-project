import connectToDatabase from "@/app/lib/db";
import Brand from "@/models/Brand";
import { NextResponse } from "next/server";
import {join} from "path";
import {writeFile} from "fs/promises";

export const GET = async () => {
    await connectToDatabase();
    try {
        const brands = await Brand.find();
        return NextResponse.json(brands, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'مشگلی در دریافت برندها رخ داده است'}, {status: 500});
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

    const name = data.get('name');

    if(!name || typeof name !== 'string' || name.trim() === ""){
        return new NextResponse(JSON.stringify({message: "فیلد نام الزامی میباشد"}), {status: 400});
    }

    // برای آپلود فایل، حتما باید آن را به بافر تبدیل کنیم:
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), '/public/uploads');
    const filePath = join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    try {
        await connectToDatabase();
        const brand = await Brand.create({
            imageUrl: `/uploads/${file.name}`,
            name: name
        });
        return new NextResponse(JSON.stringify(brand), {status: 201});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}