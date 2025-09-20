"use client"
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import LogoutButton from './components/auth/LogoutButton';
import SlideShow from './components/home/SlideShow';
import FeaturedProducts from './components/home/FeaturedProducts';
import AdsSection from './components/home/AdsSection';
import BrandSection from './components/home/BrandSection';

const Home = () => {
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (searchParams.get('msg')) {
      setMsg(searchParams.get('msg'));
      setTimeout(() => {
        setMsg("");
      }, 3000);
    }
  }, [searchParams]);
  return (
    <section id="main-body-one-col" className="main-body">
      <section className='container-xxl my-4'>
        <SlideShow/>
      </section>
      

      <section className='container-xxl my-4'>
        <FeaturedProducts/>
      </section>
      <section className='container-xxl my-4'>
        <AdsSection/>
      </section>
      <section className='container-xxl my-4'>
        <BrandSection/>
      </section>
    </section>
  );
};

export default Home;