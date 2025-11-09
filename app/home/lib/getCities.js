import { getBaseUrl } from "@/app/lib/utils";
export async function getCities(province) {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/cities?province=${province}`, {
        cache: 'force-cache',
        next:{
            revalidate: 3600,
        },
    });

    if (!response.ok) {
        throw new Error("مشگلی در دریافت شهرها رخ داده است");
        
    }
    return await response.json();
}