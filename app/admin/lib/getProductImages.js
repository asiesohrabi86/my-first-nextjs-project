import { getBaseUrl } from "@/app/lib/utils";
export async function getProductImages(id) {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/products/${id}/gallery`
        , {
        cache: 'force-cache',
        next:{
            revalidate: 120,
        },
 
    });

    if (!response.ok) {
        throw new Error("مشگلی در دریافت گالری محصول رخ داده است");
    }
    
    
    return await response.json();
}