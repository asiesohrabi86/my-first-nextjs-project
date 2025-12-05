export async function getProductGallery(id) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}/gallery`
        , {
            cache: 'force-cache',
            next:{
                revalidate: 3600,
            },
        }
    );

    if (!response.ok) {
        throw new Error("مشگلی در دریافت گالری تصاویر رخ داده است");
        
    }
    return await response.json();
}