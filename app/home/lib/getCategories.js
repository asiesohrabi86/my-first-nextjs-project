import { getBaseUrl } from "@/app/lib/utils";
export async function getCategories() {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/categories/home-menu`, {
    cache: 'force-cache',
    });  

    if (!res.ok) {
        throw new Error("مشگلی در دریافت دسته بندی ها رخ داده است");
        
    }

    return await res.json();
    
}