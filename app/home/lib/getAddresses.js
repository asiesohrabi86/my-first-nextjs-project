export async function getAddresses() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/addresses/home`
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