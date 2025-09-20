import connectToDatabase from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Address from "@/models/Address";

export async function GET(req) {
    try {
        await connectToDatabase();
        // برای نمایش سبد خرید، ابتدا باید مطمئن شویم که کاربر لاگین کرده است
        // برای چک کردن لاگین بودن در سمت سرور:
        const session = await getServerSession({req, ...authOptions});
        
        if (!session || !session.user) {
            return NextResponse.json({error: 'شما وارد سامانه نشده اید'}, {status: 401});
        }
        
        let cart = await Cart.findOne({user: session.user._id}).populate({ path: 'items.product', model: Product });
        // اگر برای کاربری که لاگین کرده، سبد خرید وجود نداشت، باید آن را بسازیم
        if (!cart) {
            cart = new Cart({user: session.user._id, items: []});
            await cart.save();
        }
        
        
        return NextResponse.json(cart);
    } catch (error) {
        return NextResponse.json({error: 'خطایی در نمایش سبد خرید رخ داده است'}, {status: 500});
    }
}

/************************************************************************************ */
// اضافه کردن آیتم به سبد خرید
export async function POST(req) {
    try {
      await connectToDatabase();
      const session = await getServerSession({req, ...authOptions});
      if (!session || !session.user) {
        return NextResponse.json({error: 'شما وارد سامانه نشده اید'}, {status: 401});
      }
    // //   محصول و تعدادش را باید از کاربر دریافت کنیم
      const {productId, quantity} = await req.json();
      if (!productId || isNaN(quantity) || quantity === 0) {
        return NextResponse.json({error: 'اطلاعات ورودی ناقص است'}, {status: 400});
      }
    //   پیدا کردن محصول
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json({error: 'محصول موردنظر یافت نشد'}, {status: 404});
      }
    //   حالا باید سبد خرید متعلق به این کابر را پیدا کنیم و محصول را به آن اضافه کنیم
      let cart = await Cart.findOne({user: session.user._id});
      if (!cart) {
        cart = new Cart({user: session.user._id, items: []});
        await cart.save();
      }
      console.log(cart);
      
    //   حالا باید چک کنیم که اگر محصول تکراری بود باید به تعدادش بیفزاییم
      const existingItem = cart.items.find(item => item.product.toString() === productId);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity <= 0) {
            cart.items.filter(item => item.product.toString() !== productId);
        }else{
            existingItem.quantity = newQuantity;
        }
      }else{
        if (quantity > 0) {
            cart.items.push({product: productId, quantity});
        }else{
            return NextResponse.json({error: 'تعداد محصول باید بیشتر از صفر باشد'}, {status: 400}); 
        }
      }

      await cart.save();
      
      return NextResponse.json(cart);

    } catch (error) {
        return NextResponse.json({error: 'خطایی در افزودن آیتم به سبد خرید رخ داده است'}, {status: 500});
    }
}

/************************************************************************************ */

export async function DELETE(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession({req, ...authOptions});
        if (!session || !session.user) {
            return NextResponse.json({error: 'شما وارد سامانه نشده اید'}, {status: 401});
        }
        
        const {productId} = await req.json();
        if (!productId) {
            return NextResponse.json({error: 'اطلاعات ورودی ناقص است'}, {status: 400});
        }
        
        const cart = await Cart.findOne({user: session.user._id});
        
        if (!cart) {
            return NextResponse.json({error: 'سبد خرید شما خالیست'}, {status: 404});   
        }
        
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        return NextResponse.json(cart);

    } catch (error) {
        return NextResponse.json({error: 'خطایی در حذف محصول از سبد خرید رخ داده است'}, {status: 500});
    }
}

/************************************************************************************ */
// اضافه کردن آدرس به سبد خرید
export async function PUT(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession({req, ...authOptions});
    if (!session || !session.user) {
      return NextResponse.json({error: 'شما وارد سامانه نشده اید'}, {status: 401});
    }
  //   پیدا کردن آدرس
    const {addressId} = await req.json();
    if (!addressId) {
      return NextResponse.json({error: 'اطلاعات ورودی ناقص است'}, {status: 400});
    }
    const address = await Address.findById(addressId);
    if (!address) {
      return NextResponse.json({error: 'آدرس موردنظر یافت نشد'}, {status: 404});
    }
  //   حالا باید سبد خرید متعلق به این کابر را پیدا کنیم و آدرس را به آن اضافه کنیم
    let cart = await Cart.findOne({user: session.user._id});
    cart.address = addressId;

    await cart.save();
    return NextResponse.json(cart);

  } catch (error) {
      return NextResponse.json({error: 'خطایی در افزودن آیتم به سبد خرید رخ داده است'}, {status: 500});
  }
}
