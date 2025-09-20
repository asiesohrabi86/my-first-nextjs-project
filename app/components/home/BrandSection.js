"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getBrands } from "@/app/home/lib/getBrands";
import BrandCard from "./BrandCard";

const BrandSection = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await getBrands();
        
                if (!Array.isArray(data)) {
                  throw new Error("داده های دریافتی معتبر نمی باشند");
                  
                }
                await setBrands(data);
        
              } catch (error) {
                setError(error);
              }finally{
                setLoading(false);
              }
        };
        fetchBrands();
    }, []);

    useEffect(() => {
        if (brands.length > 0){
            $('.dark-owl-nav').owlCarousel({
                items: 5,
                loop: true,
                autoplay: true,
                rtl: true,
                responsive: {
                    0: {items: 0},
                    576: {items: 2},
                    768: {items: 3},
                    992: {items: 5},
                  }
            });
        }
        
    }, [brands]);

    if (loading) return <div>در حال بارگزاری...</div>;
    if (error) return <div>خطا در بارگزاری داده ها</div>;

    return (
        <section className="brand-part mb-4 py-4">
            <section className="container-xxl">
                <section className="row">
                    <section className="col">
                        {/* start vontent header  */}
                        <section className="content-header">
                            <section className="d-flex align-items-center">
                                <h2 className="content-header-title">
                                    <span>برندهای ویژه</span>
                                </h2>
                            </section>
                        </section>
                        {/* start vontent header */}
                        <section className="brands-wrapper py-4">
                            <section className="brands dark-owl-nav owl-carousel owl-theme">
                                {brands.map(brand => {
                                    return (
                                        <BrandCard key={brand._id} brand={brand}/>
                                    )
                                })}
                                
                            </section>
                        </section>
                    </section>
                </section>
            </section>
        </section>
    );
};

export default BrandSection;