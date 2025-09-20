import connectToDatabase from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Order from "@/models/Order";
import Product from "@/models/Product";

const getStatusExp = async (status) => {
    let statusExp;
    switch(status){
            case '1':
                statusExp = 'در انتظار' ;
                break;
            case '2':
                statusExp = 'در حال پردازش' ;
                break;
            case '3':
                statusExp = 'تکمیل شده' ;
                break;
            case '4':
                statusExp = 'لغو شده' ;
                break;
            default:
                break;
    }
    return statusExp;
}

export async function GET(req) {
    const {searchParams} = new URL(req.url);
    let status = searchParams.get('status');

    if(status !== 0){
       var statusExp = await getStatusExp(status);
    }
    
    try {
        await connectToDatabase();
        const session = await getServerSession({req, ...authOptions});
        if (!session || !session.user) {
            return NextResponse.json({error: 'لطفا ابتدا وارد حساب کاربری خود شوید'}, {status: 401});
        }

        if(statusExp){
            var orders = await Order.find({user: session.user._id, status: statusExp}).populate({path: "items.product", model: Product}).sort({createdAt: -1});
        }else{
            orders = await Order.find({user: session.user._id}).populate({path: "items.product", model: Product}).sort({createdAt: -1});
        }
        
        return NextResponse.json({orders, statusExp});
        // const orders = await Order.find({user: session.user._id}).populate("items.product", "name, imageUrl, price");
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}