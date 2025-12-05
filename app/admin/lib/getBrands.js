export async function getBrands() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brands`, {
        // cache: 'force-cache',
        // next:{
        //     revalidate: 120,
        // },
    });

    if (!response.ok) {
        throw new Error("مشگلی در دریافت برندها رخ داده است");
        
    }
    return await response.json();
}