export async function getCities(province) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cities?province=${province}`, {
        cache: 'force-cache',
        next:{
            revalidate: 3600,
        },
    });

    if (!response.ok) {
        throw new Error("مشگلی در دریافت شهرها رخ داده است");
        
    }
    return await response.json();
}