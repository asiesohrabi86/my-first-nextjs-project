import { getBaseUrl } from "@/app/lib/utils";
export async function getAddresses() {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/addresses/home`
    //     , {
    //     cache: 'force-cache',
    //     next:{
    //         revalidate: 60,
    //     },
    // }
);

    if (!response.ok) {
        throw new Error("مشگلی در دریافت آدرس ها رخ داده است");
        
    }
    return await response.json();
}