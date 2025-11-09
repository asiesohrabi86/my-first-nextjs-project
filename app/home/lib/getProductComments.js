import { getBaseUrl } from "@/app/lib/utils";
export async function getProductComments(id) {
    console.log(id);
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/products/${id}/comments`
        , {
            cache: 'force-cache',
            next:{
                revalidate: 60,
            },
        }
    );

    if (!response.ok) {
        throw new Error("مشگلی در دریافت دیدگاه ها رخ داده است");
        
    }
    return await response.json();
}