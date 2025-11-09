import { getBaseUrl } from "@/app/lib/utils";
export async function getAdsBrands() {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/adsBrands`, {
        cache: 'force-cache',
        next:{
            revalidate: 3600,
        },
    });

    if (!response.ok) {
        throw new Error("مشگلی در دریافت برندهای تبلیغاتی رخ داده است");
        
    }
    return await response.json();
}