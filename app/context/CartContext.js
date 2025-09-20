"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({children}) {
    const [cart, setCart] = useState({items: [], discountPrice: 0});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingItem, setUpdatingItem] = useState(null);

    useEffect(() => {
        async function fetchCart() {   
            try {
                setError(null);
                const res = await fetch('/api/cart');
                if (!res.ok) {
                    setError('لطفا وارد حساب کاربری خود شوید');
                    setCart({items: [], discountPrice: 0});
                    return;
                }
                
                const data = await res.json();
                console.log(data);
                console.log(cart);
                setCart(data && data.items ? data : {items: [], discountPrice: 0});
                console.log(cart);
            } catch (error) {
                setError(error);
                setCart({items: [], discountPrice: 0});
            }finally{
                setLoading(false);
            }
        }
        fetchCart();
    }, []);

    // ************************************************************************
    // تابعی که بعد از هر تغییر در سبد خرید، باید آن را بروزرسانی کند
    async function updateCart() {
        try {
           const res = await fetch('/api/cart');
           if (res.ok) {
            const updatedCart = await res.json();
            setCart(updatedCart);
            console.log('bad az update');
           } 
        } catch (error) {
           console.log('خطا در بروزرسانی', error.message);
            
        }
        console.log(cart);
    }

     // ************************************************************************
    //  زمانیکه میخواهیم چیزی را به سبد خرید اضافه کنیم
    async function addToCart(productId, quantity = 1) {
    
        try {
            setUpdatingItem(productId);
            setError(null);
            const res = await fetch("/api/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId, quantity }),
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.error || 'خطایی در اضافه کردن محصول به سبد خرید پیش آمده است');
                return;
            }
            await updateCart();

        } catch (error) {
            setError('مشگلی در اضافه کردن محصول به سبد خرید پیش آمده است')
        } finally {
            setUpdatingItem(null);
        }
    }

    // ************************************************************************
    // برای کاهش تعداد محصول
    async function decreaseQuantity(productId) {
        try {
            const item = cart.items.find(item => item.product._id === productId);
            if (!item) {
                setError('محصول موردنظر یافت نشد');
                return;
            }
            setUpdatingItem(productId);
            if (item.quantity <= 1) {
                await removeFromCart(productId);
                return;
            }else{
                const res = await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content_Type': 'application/json'
                    },
                    body: JSON.stringify({productId, quantity: -1}),
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    setError(errorData.error || 'مشگلی در کاهش تعداد پیش آمده است');
                }
                await updateCart();
            }

        } catch (error) {
            setError('مشکلی در کاهش تعداد محصول پیش آمده است');
        } finally {
            setUpdatingItem(null);
        }
    }

    // ************************************************************************
    // برای افزاش تعداد محصول
    async function increaseQuantity(productId) {
        try {
            const item = cart.items.find(item => item.product._id === productId);
            if (!item || item.quantity >= item.product.stock) {
                setError('موجودی کافی نیست');
                return;
            }
            setUpdatingItem(productId);
            await addToCart(productId, 1);
        } catch (error) {
            setError('مشگلی در افزایش تعداد محصول پیش آمده است');
        } finally {
            setUpdatingItem(null);
        }
    }


    // ************************************************************************
    // برای پاک کردن محصول
    async function removeFromCart(productId) {
        try {
            setUpdatingItem(productId);
            const res = await fetch('/api/cart', {
                method: 'DELETE',
                headers: {
                    'Content_Type': 'application/json'
                },
                body: JSON.stringify({productId}),
            });
            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.error || 'خطایی در حذف محصول پیش آمده است');
                return;
            }

            await updateCart();
        } catch (error) {
            setError('مشگلی در حذف محصول پیش آمده است');
        } finally {
            setUpdatingItem(null);
        }
    }

    // ************************************************************************
    // برای اضافه کردن آدرس به سبد خرید
    async function addAddressToCart(addressId) {
        setLoading(true);
        try {
            const res = await fetch('/api/cart', {
                method: 'PUT',
                headers: {
                    'Content_Type': 'application/json'
                },
                body: JSON.stringify({addressId}),
            });
            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.error || 'خطایی در اضافه کردن آدرس به سبد پیش آمده است');
                return;
            }

            await updateCart();
        } catch (error) {
            setError('مشگلی در اضافه کردن آدرس به سبد خرید پیش آمده است');
        } finally {
            setLoading(false);
        }
    }

    // ************************************************************************
    // برای پاک کردن سبد خرید، مثلا وقتی که کاربر سفارشش را تمام میکند
    function clearCart() {
        setCart({items: [], discountPrice: 0});
    }

    // حالا میخواهیم از انبار ایجاد شده، استفاده کنیم
    return (<CartContext.Provider value={{
        cart,
        setCart,
        error,
        loading,
        updatingItem,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        addAddressToCart
    }}
    >
        {children}
    </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}