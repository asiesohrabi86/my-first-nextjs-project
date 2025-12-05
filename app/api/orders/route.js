import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getOrdersFromDB } from "@/app/home/lib/getOrdersFromDB";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'لطفا ابتدا وارد حساب کاربری خود شوید' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const orders = await getOrdersFromDB(session.user._id, status);
        
        return NextResponse.json({ orders });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}