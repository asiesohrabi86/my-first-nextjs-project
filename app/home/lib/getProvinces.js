export async function getProvinces() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/provinces`, {
        cache: 'force-cache',
        next:{
            revalidate: 3600,
        },
    });

    if (!response.ok) {
        throw new Error("مشگلی در دریافت استان ها رخ داده است");
        
    }
    return await response.json();
}