import { getBaseUrl } from "@/app/lib/utils";
export async function getDiscounts() {
    console.log('takhfif');
    const baseURL = getBaseUrl();
    // API call to fetch discounts
    const response = await fetch(`${baseURL}/api/discount-codes`
    //     ,{
    //     cache: 'force-cache',
    // }
);


    if (!response.ok) {
        throw new Error('مشکل در دریافت تخفیفات');
    }

    return await response.json();
 
}
