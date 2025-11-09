import { getBaseUrl } from "@/app/lib/utils";
export async function getBrands() {
    const baseURL = getBaseUrl();
    const response = await fetch(`${baseURL}/api/brands`, {
        // cache: 'force-cache',
        // next:{
        //     revalidate: 120,
        // },
    });

    if (!response.ok) {
        throw new Error("مشگلی در دریافت برندها رخ داده است");
        
    }
    return await response.json();
}