import { getBaseUrl } from "@/app/lib/utils";
export async function getProvinces() {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/provinces`, {
        cache: 'force-cache',
        next:{
            revalidate: 3600,
        },
    });

    if (!response.ok) {
        throw new Error("مشگلی در دریافت استان ها رخ داده است");
        
    }
    return await response.json();
}