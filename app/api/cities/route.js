import connectToDatabase from "@/app/lib/db";
import { NextResponse } from "next/server";
import City from "@/models/City";
import Province from "@/models/Province";

export const GET = async (req) => {
    const {searchParams} = await new URL(req.url);
    const provinceId = searchParams.get('province');
    try {
        await connectToDatabase();
        const province = await Province.findById(provinceId);
        if (!province) {
            return NextResponse.json({error: 'استان نامعتبر است'}, {status: 400});
        }

        const cities = await City.find({province: provinceId});
        return NextResponse.json(cities, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'مشگلی در دریافت استان ها رخ داده است'}, {status: 500});
    }
}
