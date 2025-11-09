import { getBaseUrl } from "@/app/lib/utils";
export async function getOrders(status) {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/orders?status=${status}`
    //     , {
    //     cache: 'force-cache',
    //     next:{
    //         revalidate: 60,
    //     },
    // }
);

    if (!response.ok) {
        throw new Error("مشگلی در دریافت سفارشات رخ داده است");
        
    }
    return await response.json();
}