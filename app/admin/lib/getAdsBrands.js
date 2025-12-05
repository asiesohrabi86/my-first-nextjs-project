export async function getAdsBrands() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/adsBrands`, {
        cache: 'force-cache',
        next:{
            revalidate: 120,
        },
    });

    if (!response.ok) {
        throw new Error("مشگلی در دریافت برندهای تبلیغاتی رخ داده است");
        
    }
    return await response.json();
}