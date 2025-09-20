import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/app/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import NextAuth from "next-auth";
import error from "@/app/error";
import { NextResponse } from "next/server";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                phone: {label: "Phone", type: "text"},
                code: {label: "OTP", type: "text"}
            },
            async authorize(credentials){
                await connectToDatabase();
                const {phone, code} = credentials;

                // check code
                const otp = await Otp.findOne({phone, code});
                
                if(!otp || otp.expiresAt < new Date()){
                    return;
                    // return 'کد نامعتبر است یا منقضی شده است';
                    // return NextResponse.json({message: 'کد نامعتبر است یا منقضی شده است'}, {status: 401});
                }

                // check user
                const user = await User.findOne({phone});
                if(!user){
                    return;
                    // return new NextResponse(JSON.stringify({message: 'کاربر یافت نشد'}), {status: 400});
                }

                // delete otp
                await Otp.deleteOne({_id: otp._id});

                return {_id: user._id.toString(), phone: user.phone, name: user.name, isAdmin: user.isAdmin};
                
            },
        }),
    ],

    sessions: {
        strategy: "jwt"
    },

    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
    // عملیات بعدی
    callbacks:{
        // اطلاعات کاربر را در توکن جی دبلیو تی و سشن ذخیره کنیم
        async jwt({token, user}){
            if(user){
                // اطلاعات کاربر را در توکن ذخیره میکنیم
                token._id = user._id;
                token.name = user.name;
                token.phone = user.phone;
                token.isAdmin = user.isAdmin
            }
            return token;
        },

        async session({session, token}) {
             // اطلاعات کاربر را در سشن ذخیره میکنیم
            session.user = {
                _id : token._id,
                name : token.name,
                phone : token.phone,
                isAdmin : token.isAdmin,
            }
            return session;
        },
    },
    pages: {
        error: "/auth/login",
    }
};

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};