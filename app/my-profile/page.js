"use client";
import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
// import { getOrders } from '../home/lib/getOrders';
import { signOut } from 'next-auth/react';
import AuthWrapper from '../components/auth/Auth';

const MyProfile = () => {
    // const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusExp, setStatusExp] = useState("");
    const searchParams = useSearchParams();
    

    // useEffect(() => {
    //     async function fetchOrders() {
    //         const status = searchParams.get('status');
    //         try {
    //             if(status){
    //                 var data = await getOrders(status);
    //             }else{
    //                data = await getOrders(0);
    //             }
                
    //             if (! data instanceof Object) {
    //                 throw new Error("داده های دریافتی معتبر نمی باشند");
                    
    //             }
    //             setOrders(data.orders);
    //             setStatusExp(data.statusExp);
    //         } catch (error) {
    //             setError(error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     fetchOrders();
    // }, [searchParams]);

    if (loading) {
        return <LoadingSpinner/>;
    }
    if (error) {
        return <div>خطا: {error.message}</div>
    }

    return (
        <AuthWrapper>
            <section className="">
                <section id="main-body-two-col" className="container-xxl body-container">
                    <section className="row">
                        <aside id="sidebar" className="sidebar col-md-3">

                            <section className="content-wrapper p-3 rounded-2 mb-3">
                                {/*  start sidebar nav */}
                                <section className="sidebar-nav">
                                    <section className="sidebar-nav-item">
                                        <span className="sidebar-nav-item-title"><Link className="p-3" href="/my-profile/my-orders">سفارش های من</Link></span>
                                    </section>
                                    <section className="sidebar-nav-item">
                                        <span className="sidebar-nav-item-title"><a className="p-3" href="my-addresses.html">آدرس های من</a></span>
                                    </section>
                                    <section className="sidebar-nav-item">
                                        <span className="sidebar-nav-item-title"><a className="p-3" href="my-favorites.html">لیست علاقه مندی</a></span>
                                    </section>
                                    <section className="sidebar-nav-item">
                                        <span className="sidebar-nav-item-title"><a className="p-3" href="/my-profile">ویرایش حساب</a></span>
                                    </section>
                                    <section className="sidebar-nav-item">
                                        <span className="sidebar-nav-item-title"><button className="p-3" onClick={() => signOut()}>خروج از حساب کاربری</button></span>
                                    </section>

                                </section>
                                {/* end sidebar nav */}
                            </section>

                        </aside>
                        <main id="main-body" className="main-body col-md-9">
                            
                        </main>
                    </section>
                </section>
            </section>
        </AuthWrapper>
    );
};

export default MyProfile;