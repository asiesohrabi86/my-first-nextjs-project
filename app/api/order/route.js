import connectToDatabase from "@/app/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

export async function POST(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession({req, ...authOptions});
        if (!session || !session.user) {
            return NextResponse.json({error: 'برای ثبت سفارش ابتدا باید وارد سامانه شوید'}, {status: 401});
        }
        let cart = await Cart.findOne({user: session.user._id}).populate({path: 'items.product', model: Product});
        if (!cart || cart.items.length === 0) {
            return NextResponse.json({error: 'سبد خرید شما خالیست'}, {status: 400});
        }
        console.log(cart);
        
        const totalPrice = cart.items.reduce((total, item) => total + (item.product.price * item.quantity || 0), 0);
        const discountPrice = cart.discountPrice || 0;
        const finalPrice = totalPrice - discountPrice;

        const newOrder = await Order.create({
            user: session.user._id,
            items: cart.items,
            totalPrice,
            discountPrice,
            finalPrice,
            status: 'در انتظار',
            address: cart.address
        });
        await Cart.deleteOne({user: session.user._id});
        return NextResponse.json({message: 'سفارش شما با موفقیت ثبت شد', orderId: newOrder._id}, {status: 201});
    } catch (error) {
        return NextResponse.json({error: 'مشگلی در ثبت سفارش پیش آمده است'}, {status: 500});
    }
}