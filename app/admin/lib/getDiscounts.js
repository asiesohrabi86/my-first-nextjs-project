export async function getDiscounts() {
    console.log('takhfif');
    // API call to fetch discounts
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/discount-codes`
    //     ,{
    //     cache: 'force-cache',
    // }
);


    if (!response.ok) {
        throw new Error('مشکل در دریافت تخفیفات');
    }

    return await response.json();
 
}
