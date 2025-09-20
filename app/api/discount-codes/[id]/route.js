import connectToDatabase from "@/app/lib/db";
import DiscountCode from "@/models/DiscountCode";
import { NextResponse } from "next/server";

export const GET = async (request, {params}) => {
    const {id} = await params;
    if(!id){
        return NextResponse.json({success: false, message: 'شناسه کد تخفیف معتبر نیست'}, {status: 404});
    }
    try {
        await connectToDatabase();
        const discount = await DiscountCode.findById(id);
        if (!discount) {
            return new NextResponse(JSON.stringify({message: 'کد تخفیف پیدا نشد'}), {status: 404});
        }
        return new NextResponse(JSON.stringify(discount), {status: 200});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}

// *********************************************************************************************************

export const PUT = async (request, {params}) => {
    const {id} = await params;
    if(!id){
        return NextResponse.json({success: false, message: 'شناسه کد تخفیف معتبر نیست'}, {status: 404});
    }
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
        const newDiscount = await DiscountCode.findByIdAndUpdate(id, {code, discountPercentage, expirationDate, isActive}, {new: true});
        return new NextResponse(JSON.stringify(newDiscount), {status: 200});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}

// *******************************************************************************************************************
export const DELETE = async (request, {params}) => {
    const {id} = await params;
    if(!id){
        return NextResponse.json({success: false, message: 'شناسه کد تخفیف معتبر نیست'}, {status: 404});
    }
    try {
        await connectToDatabase();
        const discount = await DiscountCode.findByIdAndDelete(id);
        return new NextResponse(JSON.stringify({message: 'کد تخفیف با موفقیت حذف شد'}), {status: 200});
    } catch (error) {
        return new NextResponse(JSON.stringify({message: error.message}), {status: 500});
    }
}