import { getBaseUrl } from "@/app/lib/utils";
export async function getAddress(id) {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/addresses/home/${id}`
        // , {
        //         cache: 'force-cache',
        //         next:{
        //             revalidate: 60,
        //         },
        //     }
);

    if (!response.ok) {
        throw new Error("مشگلی در دریافت آدرس رخ داده است");
        
    }
    return await response.json();
}