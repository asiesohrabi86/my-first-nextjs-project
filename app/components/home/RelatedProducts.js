"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const RelatedProducts = ({categoryId}) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const res = await fetch(`/api/products/home/related?category=${categoryId}`);
                if (!res.ok) {
                   throw new Error("خطا در دریافت اطلاعات");   
                }
                const data = await res.json();
                
                if (!Array.isArray(data)) {
                    throw new Error("خطا در دریافت اطلاعات")  
                }
                setRelatedProducts(data);
            } catch (error) {
                setError(error.message);
            }finally{
                setLoading(false);
            }
        }
        fetchRelatedProducts();
    }, [categoryId]);

    useEffect(() => {
        if (relatedProducts.length > 0) {
          $('.related-owl-carousel').owlCarousel({
            items : 4,
            loop: true,
            autoplay: true,
            rtl: true,
            responsive: {
              0: {items: 0},
              576: {items: 2},
              768: {items: 3},
              992: {items: 4},
            }
          });
        }
      }, [relatedProducts]);

    if (loading) return <p>در حال بارگزاری...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="mb-4">
            <section className="container-xxl" >
                <section className="row">
                    <section className="col">
                        <section className="content-wrapper bg-white p-3 rounded-2">
                            {/* start vontent header  */}
                            <section className="content-header">
                                <section className="d-flex justify-content-between align-items-center">
                                    <h2 className="content-header-title">
                                        <span>کالاهای مرتبط</span>
                                    </h2>
                                    <section className="content-header-link">
                                        {/* <a href="#">مشاهده همه</a> */}
                                    </section>
                                </section>
                            </section>
                            {/* start vontent header  */}
                            <section className="lazyload-wrapper" >
                                <section className="lazyload light-owl-nav related-owl-carousel owl-carousel owl-theme">
                                    {relatedProducts.map(relatedProduct => {
                                        return (
                                            <section className="item" key={relatedProduct._id}>
                                                <section className="lazyload-item-wrapper">
                                                    <section className="product">
                                                        {/* <section className="product-add-to-cart">
                                                            <a href="#" data-bs-toggle="tooltip" data-bs-placement="left" title="افزودن به سبد خرید"><i className="fa fa-cart-plus"></i></a>
                                                        </section>
                                                        <section className="product-add-to-favorite">
                                                            <a href="#" data-bs-toggle="tooltip" data-bs-placement="left" title="افزودن به علاقه مندی"><i className="fa fa-heart"></i></a>
                                                        </section> */}
                                                        <Link className="product-link" href={`/products/${relatedProduct._id}`}>
                                                            <section className="product-image">
                                                                <Image className="" src={relatedProduct.imageUrl} width={100} height={200} alt="تصویر"/>
                                                            </section>
                                                            <section className="product-name"><h3>{relatedProduct.name}</h3></section>
                                                            <section className="product-price-wrapper">
                                                                <section className="product-price">{relatedProduct.price.toLocaleString()} تومان</section>
                                                            </section>
                                                        </Link>
                                                    </section>
                                                </section>
                                            </section>
                                        )
                                    })}
                                    
                                </section>
                            </section>
                        </section>
                    </section>
                </section>
            </section>
        </section>
    );
};

export default RelatedProducts;