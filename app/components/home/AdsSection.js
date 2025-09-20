"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAdsBrands } from "@/app/home/lib/getAdsBrands";
import AdsCard from "./AdsCard";

const AdsSection = () => {
    const [adsBrands, setAdsBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const data = await getAdsBrands();
        
                if (!Array.isArray(data)) {
                  throw new Error("داده های دریافتی معتبر نمی باشند");
                  
                }
                await setAdsBrands(data);
        
              } catch (error) {
                setError(error);
              }finally{
                setLoading(false);
              }
        };
        fetchAds();
    }, []);

    if (loading) return <div>در حال بارگزاری...</div>;
    if (error) return <div>خطا در بارگزاری داده ها</div>;

    return (
        <section className="mb-3">
            <section className="container-xxl">
                {/* two column */}
                <section className="row py-4">
                    {adsBrands.map((adsBrand, index) => {
                        return (
                            <AdsCard key={adsBrand._id} adsBrand={adsBrand} index={index}/>
                        );
                    })}
                </section>

            </section>
        </section>
    );
};

export default AdsSection;