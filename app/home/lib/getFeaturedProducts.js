export async function getFeaturedProducts(){
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/featured`
        , {
            cache: 'force-cache',
        }
    );

    if (!res.ok) {
        throw new Error("مشگلی در دریافت محصولات پربازدید رخ داده است");
        
    }

    return await res.json();

}