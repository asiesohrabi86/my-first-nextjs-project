"use client";
import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { getOrders } from '../home/lib/getOrders';
import { signOut } from 'next-auth/react';
import AuthWrapper from '../components/auth/Auth';

const MyOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusExp, setStatusExp] = useState("");
    const searchParams = useSearchParams();
    

    useEffect(() => {
        async function fetchOrders() {
            const status = searchParams.get('status');
            try {
                if(status){
                    var data = await getOrders(status);
                }else{
                   data = await getOrders(0);
                }
                
                if (! data instanceof Object) {
                    throw new Error("داده های دریافتی معتبر نمی باشند");
                    
                }
                setOrders(data.orders);
                setStatusExp(data.statusExp);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(true);
            }
        }
        fetchOrders();
    }, [searchParams]);

    // if (loading) {
    //     return <LoadingSpinner/>;
    // }
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
                                        <span className="sidebar-nav-item-title"><Link className="p-3" href="/my-orders">سفارش های من</Link></span>
                                    </section>
                                    <section className="sidebar-nav-item">
                                        <span className="sidebar-nav-item-title"><a className="p-3" href="my-addresses.html">آدرس های من</a></span>
                                    </section>
                                    <section className="sidebar-nav-item">
                                        <span className="sidebar-nav-item-title"><a className="p-3" href="my-favorites.html">لیست علاقه مندی</a></span>
                                    </section>
                                    <section className="sidebar-nav-item">
                                        <span className="sidebar-nav-item-title"><a className="p-3" href="my-profile.html">ویرایش حساب</a></span>
                                    </section>
                                    <section className="sidebar-nav-item">
                                        <span className="sidebar-nav-item-title"><button className="p-3" onClick={() => signOut()}>خروج از حساب کاربری</button></span>
                                    </section>

                                </section>
                                {/* end sidebar nav */}
                            </section>

                        </aside>
                        <main id="main-body" className="main-body col-md-9">
                            <section className="content-wrapper bg-white p-3 rounded-2 mb-2">

                                {/*  start vontent header  */}
                                <section className="content-header">
                                    <section className="d-flex justify-content-between align-items-center">
                                        <h2 className="content-header-title">
                                            <span>تاریخچه سفارشات</span>
                                        </h2>
                                        <section className="content-header-link">
                                            {/* <a href="#">مشاهده همه</a> */}
                                        </section>
                                    </section>
                                </section>
                                {/*  end vontent header  */}

                                
                                <section>
                                    <section className="d-flex justify-content-center my-4">
                                        <Link className="btn btn-info btn-sm mx-1" href="/my-orders?status=1"> در انتظار پرداخت</Link>
                                        <Link className="btn btn-warning btn-sm mx-1" href="/my-orders?status=2">در حال پردازش</Link>
                                        <Link className="btn btn-success btn-sm mx-1" href="/my-orders?status=3">تکمیل شده</Link>
                                        {/* <a className="btn btn-sm mx-1" href="/my-orders?status=1">مرجوعی</a> */}
                                        <Link className="btn btn-danger btn-sm mx-1" href="/my-orders?status=4">لغو شده</Link>
                                    </section>

                                    <section className="content-header mb-3">
                                        <section className="d-flex justify-content-between align-items-center">
                                            <h2 className="content-header-title content-header-title-small">
                                                {statusExp ? `سفارشات ${statusExp}` : ' همه ی سفارشات ' }
                                            </h2>
                                            <section className="content-header-link">
                                            </section>
                                        </section>
                                    </section>
                                    {orders.length === 0 ? (
                                        <section className='text-center py-5'>
                                            <h4>هیچ سفارشی یافت نشد</h4>
                                        </section>
                                    ) : (
                                            
                                        <section className="order-wrapper">
                                            {orders.map(order => {
                                                return (
                                                    <section key={order._id} className="order-item border-bottom py-3">
                                                        <section className="d-flex justify-content-between">
                                                            <section>
                                                                <section className="order-item-date"><i className="fa fa-calendar-alt"></i>  {new Date(order.createdAt).toLocaleDateString('fa-IR', { weekday: "long", year: "numeric", month: "long",day: "numeric",})}</section>
                                                                <section className="order-item-id"><i className="fa fa-id-card-alt"></i> کد سفارش : {order._id}</section>
                                                                <section className="order-item-status"><i className="fa fa-clock"></i> {order.status}</section>
                                                                <section className="order-item-products">
                                                                    {order.items.map((item, index) => {
                                                                        return (
                                                                            <section key={index} className="d-flex mt-3 gap-3 align-items-center">
                                                                                <Image src={item.product.imageUrl} width={50} height={50} alt={item.product.name}/>
                                                                                <h6>{item.product.name}</h6>
                                                                                <p style={{marginBottom: ".697rem"}}>قیمت: {item.product.price}</p>
                                                                                <p style={{marginBottom: ".697rem"}}>تعداد: {item.quantity}</p>
                                                                            </section>
                                                                        );
                                                                    })}
                                                                </section>
                                                            </section>
                                                            {/* <section className="order-item-link"><a href="#">پرداخت سفارش</a></section> */}
                                                            <section>
                                                                <section className="order-item-total">
                                                                    <span>مبلغ کل: </span>
                                                                    <span>{order.totalPrice} تومان</span>
                                                                </section>
                                                                <section className="order-item-total">
                                                                    <span>مبلغ تخفیف: </span>
                                                                    <span>{order.discountPrice} تومان</span>
                                                                </section>
                                                                <section className="order-item-total">
                                                                    <span>مبلغ نهایی: </span>
                                                                    <span>{order.finalPrice} تومان</span>
                                                                </section>
                                                            </section>
                                                        </section>
                                                    </section>
                                                )
                                            })}

                                        </section>
                                    )}
                                </section>
                                
                            </section>
                        </main>
                    </section>
                </section>
            </section>
        </AuthWrapper>
    );
};

export default MyOrder;