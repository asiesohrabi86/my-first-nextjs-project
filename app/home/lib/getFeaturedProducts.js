import { getBaseUrl } from "@/app/lib/utils";
export async function getFeaturedProducts(){
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/products/featured`
        , {
            cache: 'force-cache',
        }
    );

    if (!res.ok) {
        throw new Error("مشگلی در دریافت محصولات پربازدید رخ داده است");
        
    }

    return await res.json();

}