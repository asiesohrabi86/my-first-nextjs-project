export async function getCategories() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/home-menu`, {
    cache: 'force-cache',
    });  

    if (!res.ok) {
        throw new Error("مشگلی در دریافت دسته بندی ها رخ داده است");
        
    }

    return await res.json();
    
}