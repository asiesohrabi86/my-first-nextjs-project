"use client";
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { getProductGallery } from "@/app/home/lib/getProductGallery";

const ProductGallery = ({id, images}) => {
    const mainImage  = Array.isArray(images) && images.length > 0 ? images[0] : images;
    const [productGallery, setProductGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mainImg = useRef();

    useEffect(() => {
        const fetchProductGallery = async () => {
            try {
                const data = await getProductGallery(id);
        
                if (!Array.isArray(data)) {
                  throw new Error("داده های دریافتی معتبر نمی باشند");
                  
                }
                setProductGallery(data);
        
              } catch (error) {
                setError(error);
              }finally{
                setLoading(false);
              }
        }
        fetchProductGallery();
    }, [id]);

    const changeMainImage = (e) => {
        mainImg.current.src = e.target.src;
    }

    return (
        <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
            <section className="product-gallery">
                <section className="product-gallery-selected-image mb-3">
                    <img ref={mainImg} src={mainImage} alt="تصویر محصول" width={200} height={250}/>
                </section>
                <section className="product-gallery-thumbs">
                    {productGallery && productGallery.map(productImage => {
                        return <Image key={productImage._id} onClick={changeMainImage} className="product-gallery-thumb" src={productImage.imageUrl} alt="" width={100} height={100}/>
                    })}
                    
                </section>
            </section>
        </section>
    );
};

export default ProductGallery;