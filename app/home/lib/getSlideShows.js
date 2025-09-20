export async function getSlideShows() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/slideShows`
        , {
            cache: 'force-cache',
            next:{
                revalidate: 3600,
            },
        }
    );

    if (!response.ok) {
        throw new Error("مشگلی در دریافت اسلایدشوها رخ داده است");
        
    }
    return await response.json();
}