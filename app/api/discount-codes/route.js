import connectToDatabase from "@/app/lib/db"
import DiscountCode from "@/models/DiscountCode";
import { NextResponse } from "next/server";

export async function GET(request) {
    console.log('hi');
    try {
        await connectToDatabase();
        
        const discounts = await DiscountCode.find();
        return new NextResponse(JSON.stringify(discounts), {status: 200});
    } catch (error) {
        return new NextResponse(JSON.stringify({error: 'خطا در دریافت کدهای تخفیف'}), {status: 500});
    }
    
}

export async function POST(request) {
    const {code, discountPercentage, expirationDate, isActive} = await request.json();
    //*********************** */start backend validation**********************
    if (!code || typeof code !== "string" || code.trim() === "") {
        return new NextResponse(JSON.stringify({message: "کد تخفیف الزامیست"}, {status: 400}));
    }else if(code.length < 3 || code.length > 30){
        return new NextResponse(JSON.stringify({message: 'کد تخفیف باید بین 3 تا 30 کاراکتر باشد'}, {status: 400}));
    }

    if (!discountPercentage || isNaN(discountPercentage)) {
        return new NextResponse(JSON.stringify({message: "درصد تخفیف الزامیست"}, {status: 400}));
    }else if (discountPercentage < 1 || discountPercentage > 100) {
        return new NextResponse(JSON.stringify({message: "درصد تخفیف بین  1 تا 100 میباشد"}, {status: 400}));
    }
    
    if (!expirationDate || !expirationDate instanceof Date) {
        return new NextResponse(JSON.stringify({message: "تاریخ انقضای تخفیف الزامیست"}, {status: 400}));
    }else if(expirationDate < new Date()){
        return new NextResponse(JSON.stringify({message: "تاریخ انقضای تخفیف نامعتبر است"}, {status: 400}));
    }

    if (typeof isActive != 'boolean' ) {
        return new NextResponse(JSON.stringify({message: "وضعیت تخفیف الزامیست"}, {status: 400}));
    }

    //*********************** */end backend validation**********************
    try {
        await connectToDatabase();
        const discount = await DiscountCode.create({code, discountPercentage, expirationDate, isActive});
        return new NextResponse(JSON.stringify(discount), {status: 201});
    } catch (error) {
        return new NextResponse(JSON.stringify({error: 'خطا در اتصال به دیتابیس'}), {status: 500});
    }
    
}