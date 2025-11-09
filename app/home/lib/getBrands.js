import { getBaseUrl } from "@/app/lib/utils";
export async function getBrands() {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/brands`, {
        cache: 'force-cache',
        next:{
            revalidate: 3600,
        },
    });

    if (!response.ok) {
        throw new Error("مشگلی در دریافت برندها رخ داده است");
        
    }
    return await response.json();
}