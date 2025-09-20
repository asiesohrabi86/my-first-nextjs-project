"use client";
import { useCart } from '@/app/context/CartContext';
import React, { useState } from 'react';

const AddToCartButton = ({productId}) => {
    const {addToCart, error} = useCart();
    const [loading, setLoading] = useState(false);
    // برای اینکه ارورهای کارت با ارورهای این کامپوننت قاطی نشود
    const [localError, setLocalError] = useState(null);

    const handleAddToCart = async () => {
        setLoading(true);
        setLocalError(null);
        
        await addToCart(productId, 1);

        if (error) {
            setLocalError(error);
        }
        setLoading(false);
    }
    return (
        <section className="">
            <button disabled={loading} onClick={handleAddToCart} className="btn btn-danger d-block">
                {loading? 'در حال افزودن' : 'افزودن به سبد خرید'}
            </button>
            {localError && <p calssName="text-danger mt-3">{localError}</p>}
        </section>
    );
};

export default AddToCartButton;