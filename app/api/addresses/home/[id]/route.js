import connectToDatabase from "@/app/lib/db";
import { authOptions } from "../../../auth/[...nextauth]/route";
import Address from "@/models/Address";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Province from "@/models/Province";
import City from "@/models/City";

export const GET = async (req, {params}) => {
    const {id} = await params;
    if(!id){
        return NextResponse.json({error: 'شناسه آدرس معتبر نیست'}, {status: 404});
    }
    try {
        await connectToDatabase();
        const session = await getServerSession({req, ...authOptions});
        if (!session || !session.user) {
            
            return NextResponse.json({error: 'شما وارد سامانه نشده اید'}, {status: 401});
        }
        
        const address = await Address.findById(id);
        if (!address) {
            return NextResponse.json({error: 'آدرس موردنظر یافت نشد'}, {status: 400});
        }
        return NextResponse.json(address, {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'مشگلی در دریافت آدرس رخ داده است'}, {status: 500});
    }
}

// ******************************************************************************

export async function PUT(req, {params}){
    const {id} = await params;
    if(!id){
        return NextResponse.json({error: 'شناسه آدرس معتبر نیست'}, {status: 404});
    }
    const body = await req.json();
    
    //   backend validation
    if (!body.province || body.province.trim().length !== 24 || typeof body.province !== "string") {
    return NextResponse.json({error: 'انتخاب استان الزامیست'}, {status: 400});
    }
    if (!body.city || body.city.trim().length !== 24 || typeof body.city !== "string") {
        return NextResponse.json({error: 'انتخاب شهر الزامیست'}, {status: 400});
    }
    if (!body.address || body.address.trim() === "" || typeof body.address !== "string") {
        return NextResponse.json({error: 'نشانی الزامیست'}, {status: 400});
    }
    if (!body.postalCode || body.postalCode.trim().length !== 10 || typeof body.postalCode !== "string") {
        return NextResponse.json({error: "کد پستی الزامیست"}, {status: 400});
    }
    
    const postalCodePattern = /\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b/;
    if (!postalCodePattern.test(body.postalCode)) {
        return NextResponse.json({error: "کد پستی نامعتبر است"}, {status: 400});
    }
    if (!body.number || isNaN(body.number)) {
        return NextResponse.json({error: "پلاک الزامیست"}, {status: 400});
    }
    if (!body.unit || isNaN(body.unit)) {
        return NextResponse.json({error: "واحد الزامیست"}, {status: 400});
    }

    if (typeof body.isRecepient != 'boolean' ) {
        return NextResponse.json({error: "خطای اعتبارسنجی"}, {status: 400});
    }
    
    if (!body.isRecepient) { 
        if (!body.recepientFirstName || body.recepientFirstName.trim() === "" || typeof body.recepientFirstName !== "string") {
            return NextResponse.json({error: "درصورتیکه گیرنده خودتان نیستید، نام گیرنده الزامیست"}, {status: 400});
        }
        
        if (!body.recepientLastName || body.recepientLastName.trim() === "" || typeof body.recepientLastName !== "string") {
            return NextResponse.json({error: "درصورتیکه گیرنده خودتان نیستید، نام خانوادگی گیرنده الزامیست"}, {status: 400});
        }
        if (!body.recepientMobile || body.recepientMobile.trim() === "" || typeof body.recepientMobile !== "string") {
            return NextResponse.json({error: "درصورتیکه گیرنده خودتان نیستید، موبایل گیرنده الزامیست"}, {status: 400});
        }
        const mobilePattern = /^(\+98|98|0)9\d{9}$/;
        if (!mobilePattern.test(body.recepientMobile)) {
            return NextResponse.json({error: " موبایل گیرنده نامعتبر است"}, {status: 400});
        }
    }
    try {
        await connectToDatabase();
        const session = await getServerSession({req, ...authOptions});
        if (!session || !session.user) {
            return NextResponse.json({error: 'شما وارد سامانه نشده اید'}, {status: 401});
        }
        
        const province = await Province.findById(body.province);
        if (!province) {
            return NextResponse.json({error: 'استان نامعتبر است'}, {status: 400});
        }
        const city = await City.findById(body.city);
        if (!city) {
            return NextResponse.json({error: 'شهر نامعتبر است'}, {status: 400});
        }

        const address = await Address.findById(id);
        if (!address) {
            return NextResponse.json({error: 'آدرس موردنظر یافت نشد'}, {status: 400});
        }
        
        const updatedAddress = await Address.findByIdAndUpdate(id, {
            user: session.user._id,
            province: body.province,
            city: body.city,
            address: body.address,
            postalCode: body.postalCode,
            number: body.number,
            unit: body.unit,
            isRecepient: body.isRecepient,
            recepientFirstName: body.recepientFirstName ? body.recepientFirstName : "",
            recepientLastName: body.recepientLastName ? body.recepientLastName : "",
            recepientMobile : body.recepientMobile ? body.recepientMobile : "",
        }, {new: true});
        
        return new NextResponse(JSON.stringify(updatedAddress), {status: 200});
    } catch (error) {
        return NextResponse.json({error: 'خطایی در ویرایش آدرس رخ داده است'}, {status: 500});
    }
}

/************************************************************************************ */

export async function DELETE(req, {params}) {
    const {id} = await params;
    if(!id){
        return NextResponse.json({error: 'شناسه آدرس معتبر نیست'}, {status: 404});
    }
    try {
        await connectToDatabase();
        const session = await getServerSession({req, ...authOptions});
        if (!session || !session.user) {
            return NextResponse.json({error: 'شما وارد سامانه نشده اید'}, {status: 401});
        }
        
        const address = await Address.findById(id);
        if (!address) {
            return NextResponse.json({error: 'اطلاعات ورودی ناقص است'}, {status: 400});
        }
        
        await Address.findByIdAndDelete(id);
        return NextResponse.json({message: 'آدرس با موفقیت حذف شد'}, {status: 200});

    } catch (error) {
        return NextResponse.json({error: 'خطایی در حذف آدرس رخ داده است'}, {status: 500});
    }
}