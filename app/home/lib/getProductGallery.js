import { getBaseUrl } from "@/app/lib/utils";
export async function getProductGallery(id) {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/products/${id}/gallery`
        , {
            cache: 'force-cache',
            next:{
                revalidate: 3600,
            },
        }
    );

    if (!response.ok) {
        throw new Error("مشگلی در دریافت گالری تصاویر رخ داده است");
        
    }
    return await response.json();
}