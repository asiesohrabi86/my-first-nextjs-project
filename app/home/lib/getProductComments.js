export async function getProductComments(id) {
    console.log(id);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}/comments`
        , {
            cache: 'force-cache',
            next:{
                revalidate: 3600,
            },
        }
    );

    if (!response.ok) {
        throw new Error("مشگلی در دریافت دیدگاه ها رخ داده است");
        
    }
    return await response.json();
}