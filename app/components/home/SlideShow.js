"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getSlideShows } from "@/app/home/lib/getSlideShows";

const SlideShow = () => {
    const [slideShows, setSlideShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const  fetchSlideShows = async () => {
            try {
                const data = await getSlideShows();
        
                if (!Array.isArray(data)) {
                  throw new Error("داده های دریافتی معتبر نمی باشند");
                  
                }
                await setSlideShows(data);
        
              } catch (error) {
                setError(error);
              }finally{
                setLoading(false);
              }
        }
        fetchSlideShows();
    }, []);

    useEffect(() => {
        if (slideShows.length > 0) {
          $('.slideShows-owl-carousel').owlCarousel({
            items : 1,
            loop: true,
            autoplay: true,
            rtl: true,
            responsive: {
              0: {items: 0},
              576: {items: 1},
              768: {items: 1},
              992: {items: 1},
            }
          });
        }
      }, [slideShows]);

    if (loading) return <div>در حال بارگزاری...</div>;
    if (error) return <div>خطا در بارگزاری داده ها</div>;
  
  return (
    <section className="row">
      <section className="col-md-8 pe-md-1 ">
        <section id="slideshow" className="owl-carousel slideShows-owl-carousel owl-theme">
           {slideShows.map((slideShow, index) => {
            if(index<=5){
                return (
                    <section className="item" key={index}>
                        <a className="w-100 d-block h-auto text-decoration-none" href={slideShow.url}>
                        <Image priority
                            src={slideShow.imageUrl}
                            alt={`Slide ${index+1}`}
                            width={800}
                            height={400}
                            className="w-100 rounded-2"
                        />
                        </a>
                    </section>
                );
            }
            
           })}
         
        </section>
      </section>
      <section className="col-md-4 ps-md-1 mt-2 mt-md-0">
        {slideShows.map((slideShow, index) => {
            if(index>5){
                return (
                <section className="mb-2" key={index}>
                    <a href={slideShow.url} className="d-block">
                      <Image priority
                        src={slideShow.imageUrl}
                        alt={`Slide ${index+1}`}
                        width={400}
                        height={200}
                        className="w-100 rounded-2"
                      />
                    </a>
                </section>)
            }
        })}
        
      </section>
    </section>
  );
};

export default SlideShow;
