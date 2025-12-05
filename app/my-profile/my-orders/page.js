import React from 'react';
import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getOrdersFromDB } from "@/app/home/lib/getOrdersFromDB";
import AuthWrapper from '../../components/auth/Auth';
import ProfileSidebar from "@/app/my-profile/ProfileSidebar";
import { formatDate } from "@/app/lib/utils";

// نگاشت وضعیت‌های URL (اعداد) به وضعیت‌های دیتابیس (متن فارسی طبق مدل)
const urlStatusToDbStatus = {
    '1': 'در انتظار',
    '2': 'در حال پردازش',
    '3': 'تکمیل شده',
    '4': 'لغو شده'
};

// تابع دریافت استایل و آیکون بر اساس متن فارسی وضعیت (طبق مدل)
const getStatusInfo = (statusText) => {
    switch (statusText) {
        case 'در انتظار': 
            return { text: 'در انتظار', icon: 'fa-clock', className: 'text-info' };
        case 'در حال پردازش': 
            return { text: 'در حال پردازش', icon: 'fa-cog', className: 'text-warning' };
        case 'تکمیل شده': 
            return { text: 'تکمیل شده', icon: 'fa-check-circle', className: 'text-success' };
        case 'لغو شده': 
            return { text: 'لغو شده', icon: 'fa-times-circle', className: 'text-danger' };
        default: 
            return { text: statusText, icon: 'fa-info-circle', className: 'text-secondary' };
    }
};

export default async function MyOrderPage({ searchParams }) {
    
    // دریافت پارامتر status از URL (مثلا 1، 2، 3)
    const { status } = searchParams;
    
    // تبدیل کد URL به متن دیتابیس برای جستجو
    // اگر status در URL نباشد، مقدار null رد می‌شود تا همه سفارش‌ها گرفته شوند
    const dbStatus = status ? urlStatusToDbStatus[status] : null;

    const session = await getServerSession(authOptions);
    
    let orders = [];
    
    if (session?.user) {
        try {
            // ارسال متن فارسی یا null به تابع دیتابیس
            orders = await getOrdersFromDB(session.user._id, dbStatus);
        } catch (error) {
            console.error("Error fetching orders:", error);
            return <div className="alert alert-danger m-4">خطا در بارگذاری سفارشات. لطفا دوباره تلاش کنید.</div>;
        }
    } else {
        return <div className="alert alert-warning m-4">برای مشاهده سفارشات، لطفا وارد حساب کاربری خود شوید.</div>;
    }

    // اطلاعات وضعیت فعلی برای نمایش در هدر صفحه
    const currentStatusInfo = dbStatus ? getStatusInfo(dbStatus) : null;

    return (
        <AuthWrapper>
            <section className="">
                <section id="main-body-two-col" className="container-xxl body-container">
                    <section className="row">
                        
                        <ProfileSidebar /> 
                        
                        <main id="main-body" className="main-body col-md-9">
                            <section className="content-wrapper bg-white p-3 rounded-2 mb-2">
                                <section className="content-header">
                                    <h2 className="content-header-title"><span>تاریخچه سفارشات</span></h2>
                                </section>
                                
                                <section>
                                    {/* دکمه‌های فیلتر با استفاده از اعداد در URL */}
                                    <section className="d-flex justify-content-center flex-wrap my-4 gap-2">
                                        <Link className={`btn btn-sm mx-1 ${status === '1' ? 'btn-info' : 'btn-outline-info'}`} href="/my-orders?status=1">در انتظار پرداخت</Link>
                                        <Link className={`btn btn-sm mx-1 ${status === '2' ? 'btn-warning' : 'btn-outline-warning'}`} href="/my-orders?status=2">در حال پردازش</Link>
                                        <Link className={`btn btn-sm mx-1 ${status === '3' ? 'btn-success' : 'btn-outline-success'}`} href="/my-orders?status=3">تکمیل شده</Link>
                                        <Link className={`btn btn-sm mx-1 ${status === '4' ? 'btn-danger' : 'btn-outline-danger'}`} href="/my-orders?status=4">لغو شده</Link>
                                        {status && <Link className="btn btn-secondary btn-sm mx-1" href="/my-orders">همه سفارشات</Link>}
                                    </section>

                                    <section className="content-header mb-3">
                                        <h2 className="content-header-title content-header-title-small">
                                            {currentStatusInfo ? `سفارشات ${currentStatusInfo.text}` : 'همه ی سفارشات'}
                                        </h2>
                                    </section>

                                    {orders.length === 0 ? (
                                        <section className='text-center py-5'>
                                            <i className="fa fa-shopping-basket fa-3x text-muted mb-3"></i>
                                            <h4 className="text-muted">هیچ سفارشی یافت نشد</h4>
                                        </section>
                                    ) : (
                                        <section className="order-wrapper">
                                            {orders.map(order => {
                                                // دریافت اطلاعات نمایش بر اساس متن فارسی ذخیره شده در دیتابیس
                                                const statusDetails = getStatusInfo(order.status);
                                                
                                                return (
                                                    <section key={order._id} className="order-item border p-3 mb-3 rounded shadow-sm bg-white">
                                                        
                                                        {/* ردیف اول: تاریخ و کد سفارش */}
                                                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                                                            <section className="order-item-date text-muted">
                                                                <i className="fa fa-calendar-alt me-1"></i> {formatDate(order.createdAt)}
                                                            </section>
                                                            <section className="order-item-id text-muted">
                                                                <i className="fa fa-id-card-alt me-1"></i> کد سفارش : {order._id}
                                                            </section>
                                                        </div>

                                                        {/* ردیف دوم: وضعیت */}
                                                        <section className={`order-item-status mb-3 fw-bold ${statusDetails.className}`}>
                                                            <i className={`fa ${statusDetails.icon} me-1`}></i> {statusDetails.text}
                                                        </section>

                                                        {/* ردیف سوم: محصولات */}
                                                        {/* طبق مدل، آرایه items داریم و داخل آن product رفرنس شده است */}
                                                        <section className="order-item-products d-flex flex-wrap gap-2 mb-3">
                                                            {order.items && order.items.map((item, index) => (
                                                                <Link key={index} href={`/products/${item.product?.slug || item.product?._id || '#'}`} title={item.product?.name}>
                                                                    <img 
                                                                        src={item.product?.imageUrl || item.product?.image || "/assets/images/placeholder.png"} 
                                                                        alt={item.product?.name || "Product"} 
                                                                        className="rounded border"
                                                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                                    />
                                                                </Link>
                                                            ))}
                                                        </section>

                                                        {/* دکمه پرداخت (فقط اگر وضعیت 'در انتظار' باشد) */}
                                                        {order.status === 'در انتظار' && (
                                                            <section className="order-item-link text-end border-top pt-2 mt-2">
                                                                <a href={`/payment/${order._id}`} className="btn btn-sm btn-success">
                                                                    <i className="fa fa-credit-card me-1"></i> پرداخت سفارش
                                                                </a>
                                                            </section>
                                                        )}
                                                        
                                                    </section>
                                                );
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