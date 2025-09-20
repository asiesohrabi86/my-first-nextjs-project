"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], discountPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);

  useEffect(() => {
    async function fetchCart() {
      try {
        setError(null);
        const res = await fetch("/api/cart");
        if (!res.ok) {
          setError("Failed to fetch cart");
          setCart({ items: [], discountPrice: 0 });
          return;
        }

        const data = await res.json();
        setCart(data && data.items ? data : { items: [], discountPrice: 0 });
      } catch (error) {
        setError(error);
        setCart({ items: [], discountPrice: 0 });
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  async function updateCart() {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const updatedCart = await res.json();
        setCart(updatedCart);
      }
    } catch (error) {
      console.log("خطا در بروز رسانی", error.message);
    }
  }

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
        setError(
          errorData.message || "مشکلی در اضافه کردن به سبد خرید پیش آمده است"
        );
        return;
      }

      await updateCart();
    } catch (error) {
      setError("مشکلی در اضافه کردن به سبد خرید پیش آمده است");
    } finally {
      setUpdatingItem(null);
    }
  }

  async function decreaseQuantity(productId) {
    try {
      const item = cart.items.find((item) => item.productId === productId);
      if (!item) {
        setError("محصول مورد نظر یافت نشد");
        return;
      }

      setUpdatingItem(productId);

      if (item.quantity <= 1) {
        await removeFromCart(productId);
        return;
      }

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: -1 }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "مشکلی در کاهش تعداد پیش آمده است");
      }

      await updateCart();
    } catch (error) {
      setError("مشکلی در کاهش تعداد پیش آمده است");
    } finally {
      setUpdatingItem(null);
    }
  }

  async function increaseQuantity(productId) {
    try {
      const item = cart.items.find((item) => item.productId === productId);
      if (!item || item.quantity >= item.product.stock) {
        setError("موجودی کافی نیست");
        return;
      }

      setUpdatingItem(productId);

      await addToCart(productId, 1);
    } catch (error) {
      setError("مشکلی در کاهش افزایش پیش آمده است");
    } finally {
      setUpdatingItem(null);
    }
  }

  async function removeFromCart(productId) {
    try {
      setUpdatingItem(productId);
      const rest = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "مشکلی در حذف محصول پیش آمده است");
        return;
      }

      await updateCart();
    } catch (error) {
      setError("مشکلی در حذف محصول پیش آمده است");
    } finally {
      setUpdatingItem(null);
    }
  }

  function clearCart() {
    setCart({ items: [], discountPrice: 0 });
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        error,
        loading,
        updatingItem,
        addToCart,
        decreaseQuantity,
        increaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
