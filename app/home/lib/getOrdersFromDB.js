import connectToDatabase from "@/app/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product"; // اطمینان حاصل کنید که این مدل برای populate کردن نیاز است

const getStatusExp = (status) => {
    switch (status) {
        case '1': return 'در انتظار';
        case '2': return 'در حال پردازش';
        case '3': return 'تکمیل شده';
        case '4': return 'لغو شده';
        default: return undefined;
    }
};

export async function getOrdersFromDB(userId, status) {
    try {
        await connectToDatabase();
        
        const statusExp = status ? getStatusExp(status.toString()) : undefined;

        let query = { user: userId };
        if (statusExp) {
            query.status = statusExp;
        }

        // populate کردن مدل Product برای دسترسی به اطلاعات محصول در هر سفارش
        const orders = await Order.find(query)
            .populate({ path: "items.product", model: Product, select: 'name imageUrl price' }) // فقط فیلدهای مورد نیاز را انتخاب کنید
            .sort({ createdAt: -1 })
            .lean(); // .lean() خروجی را به صورت آبجکت‌های ساده جاوااسکریپت برمی‌گرداند (سریع‌تر و نیاز به serialize دستی ندارد)

        return orders;

    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("مشکلی در دریافت سفارشات از دیتابیس رخ داده است.");
    }
}