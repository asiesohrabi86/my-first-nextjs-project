import { getBaseUrl } from "@/app/lib/utils";
export async function getSlideShows() {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/slideShows`, {
        // cache: 'force-cache',
        // next:{
        //     revalidate: 120,
        // },
    });

    if (!response.ok) {
        throw new Error("مشگلی در دریافت اسلایدشوها رخ داده است");
        
    }
    return await response.json();
}