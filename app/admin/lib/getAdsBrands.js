import { getBaseUrl } from "@/app/lib/utils";
export async function getAdsBrands() {
    const baseURL = getBaseUrl();
    const response = await fetch(`${baseURL}/api/adsBrands`, {
        // cache: 'force-cache',
        // next:{
        //     revalidate: 120,
        // },
    });

    if (!response.ok) {
        throw new Error("مشگلی در دریافت برندهای تبلیغاتی رخ داده است");
        
    }
    return await response.json();
}