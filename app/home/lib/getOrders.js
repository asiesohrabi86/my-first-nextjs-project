export async function getOrders(status) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders?status=${status}`
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