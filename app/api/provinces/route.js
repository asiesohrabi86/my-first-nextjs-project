import connectToDatabase from "@/app/lib/db";
import { NextResponse } from "next/server";
import Province from "@/models/Province";

export const GET = async () => {
    try {
        await connectToDatabase();
        const provinces = await Province.find();
        return NextResponse.json(provinces, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'مشگلی در دریافت استان ها رخ داده است'}, {status: 500});
    }
}
