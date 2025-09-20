export async function getAddress(id) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/addresses/home/${id}`
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