"use client";
import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import AuthWrapper from '../components/auth/Auth';
import ProfileSidebar from "@/app/my-profile/ProfileSidebar";

const MyProfile = () => {
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
                        <ProfileSidebar/>
                        <main id="main-body" className="main-body col-md-9">
                            
                        </main>
                    </section>
                </section>
            </section>
        </AuthWrapper>
    );
};

export default MyProfile;