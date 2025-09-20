"use client";
import React, { createContext, useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import Button from 'react-bootstrap/Button';
import { Alert } from 'react-bootstrap';
import AddressSection from '../components/home/AddressSection';

export default function Checkout() {
    // وقتی پرداخت انجام میشود و سفارش ثبت میشود، باید سبد خرید پاک شود، به همین دلیل کلیرکارت را نیاز داریم
    const {cart, clearCart} =useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [discountCode, setDiscountCode] = useState("");
    // میخواهیم بفهمیم قبلا کد تخفیف استفاده شده و اگر شده، مبلغش چقدر است و در ابتدا(اگر کد را نزده باشد) صفر است
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    // اگر در فرآیند ثبت کد تخفیف ارور داشته باشیم
    const [discountError, setDiscountError] = useState(null);
    // آیا قبلا کد تخفیف اعمال شده یا خیر
    const [isDiscountApplied, setIsDiscountApplied] = useState(false);


    // برای اینکه مطمئن شویم کاربر دوباره کد تخفیف نزند
    useEffect(() => {
        if (cart && cart.discountPrice > 0) {
            setAppliedDiscount(cart.discountPrice);
            setIsDiscountApplied(true);
        }
    }, [cart]);

    if (!cart || cart.items.length === 0) {
        return (
            <main  className="main-body">
                <section className="container-xxl text-center py-5" >
                    <h4>سبد خرید شما خالیست</h4>
                    <Link className='btn btn-primary mt-3' href="/">بازگشت به فروشگاه</Link>
                </section> 
            </main>
          ); 
    }

    const totalPrice = cart?.items?.reduce(
        (total, item) => total + (item.product.price) * item.quantity
        , 0);
    const payabbleAmount = totalPrice - appliedDiscount;

    const applyDiscount = async () => {
        // ابتدا چک میکنیم کاربر قبلا کد تخفیف را استفاده کرده
        if (isDiscountApplied) {
          setDiscountCode("شما قبلا کد تخفیف را اعمال کرده اید");
          return;
        }
    
        setDiscountError("");
    
        if (!discountCode.trim()) {
          setDiscountError("کد تخفیف را وارد کنید");
          return;
        }

        try {
            const res = await fetch("/api/discount-codes/home", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code: discountCode }),
            });

            // این بخش برای امنیت نوشته شده
            // const contentType = res.headers.get('content-type');
            // if (!contentType || !contentType.includes('application/json')) {
            //     throw new Error('مشگلی در اعمال کد تخفیف پیش آمده است');
            // }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "کد تخفیف نا معتبر است");
            }

            setAppliedDiscount(data.discountPrice);
            setIsDiscountApplied(true);

        } catch (error) {
            setDiscountError(error.message || "مشکلی در اعمال کد تخفیف پیش آمده است");
        }
    };
    async function handleOrderSubmit(params) {
        setLoading(true);
        try {
            const res = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content_Type' : 'application/json'
                },
                // چون اطلاعات سبد خرید را در دیتابیس ذخیره میکنیم، نیازی به ارسال بادی نیست
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'مشگلی در ثبت سفارش پیش آمده است');   
            }

            alert('سفارش با موفقیت ثبت شد');
            clearCart();

        } catch (error) {
            alert(error.message || 'مشگلی در ثبت سفارش رخ داده است'); 
        } finally {
            setLoading(false);
        }
    }

    return (
        <main id="main-body-one-col" className="main-body">

            {/*  start cart --> */}
            <section className="mb-4">
                <section className="container-xxl" >
                    <section className="row">
                        <section className="col">
                            
                            <section className="row mt-4">
                                {error && <Alert variant='danger'>{error}</Alert>}
                                <section className="col-md-9">
                                    <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
            
                                        {/*  start vontent header  */}
                                        <section className="content-header mb-3">
                                            <section className="d-flex justify-content-between align-items-center">
                                                <h2 className="content-header-title content-header-title-small">
                                                    کد تخفیف
                                                </h2>
                                                <section className="content-header-link">
                                                    {/* <a href="#">مشاهده همه</a> */}
                                                </section>
                                            </section>
                                        </section>

                                        <section className="payment-alert alert alert-primary d-flex align-items-center p-2" role="alert">
                                            <i className="fa fa-info-circle flex-shrink-0 me-2"></i>
                                            <section>
                                                کد تخفیف خود را در این بخش وارد کنید.
                                            </section>
                                        </section>

                                        <section className="row">
                                            <section className="col-md-5">
                                                <section className="input-group input-group-sm">
                                                    <input value={discountCode} onChange={e => setDiscountCode(e.target.value)} 
                                                    disabled={isDiscountApplied}  type="text" className="form-control" placeholder="کد تخفیف را وارد کنید"
                                                    />
                                                    <button className="btn btn-primary" onClick={applyDiscount} disabled={isDiscountApplied} type="button">اعمال کد</button>
                                                </section>
                                                {discountError && <p className="text-danger mt-2">{discountError}</p>}
                                            </section>

                                        </section>
                                    </section>
                                    <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
                                        {cart.items.map(item => {
                                            return (
                                                <section className='cart-item d-sm-flex justify-content-sm-between p-3 border-bottom' key={item.product._id}>
                                                    <section className='align-self-start'>
                                                        <p className='fw-bold'>{item.product.name}</p>
                                                        <p>تعداد: {item.quantity}</p>
                                                        <p className='fw-bold'>
                                                            {(item.product.price * item.quantity).toLocaleString()}
                                                            تومان
                                                        </p>
                                                    </section>
                                                    <section>
                                                        {item.product.imageUrl ? 
                                                        <Image src={item.product.imageUrl} height={100} width={100} alt={item.product.name}/> 
                                                        : <p>تصویر محصول موجود نیست</p>}
                                                    </section>
                                                </section>
                                            );
                                        })}
                                    </section>
                                    <AddressSection/>
                                </section>


                                <section className="col-md-3">
                                    <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
                                        <section className="d-flex justify-content-between align-items-center">
                                            <p className="text-muted">قیمت کالاها ({cart.items.length})</p>
                                            <p className="text-muted">{totalPrice.toLocaleString()} تومان</p>
                                        </section>

                                        {/* <section className="d-flex justify-content-between align-items-center">
                                            <p className="text-muted">تخفیف کالاها</p>
                                            <p className="text-danger fw-bolder">78,000 تومان</p>
                                        </section> */}

                                        <section className="border-bottom mb-3"></section>

                                        {/* <section className="d-flex justify-content-between align-items-center">
                                            <p className="text-muted">جمع سبد خرید</p>
                                            <p className="fw-bolder">320,000 تومان</p>
                                        </section>

                                        <section className="d-flex justify-content-between align-items-center">
                                            <p className="text-muted">هزینه ارسال</p>
                                            <p className="text-warning">54,000 تومان</p>
                                        </section> */}

                                        <section className="d-flex justify-content-between align-items-center">
                                            <p className="text-muted">تخفیف اعمال شده</p>
                                            <p className="text-danger">{appliedDiscount.toLocaleString()} تومان</p>
                                        </section>

                                        <p className="my-3">
                                            <i className="fa fa-info-circle me-1"></i> کاربر گرامی کالاها بر اساس نوع ارسالی که انتخاب می کنید در مدت زمان ذکر شده ارسال می شود.
                                        </p>

                                        <section className="border-bottom mb-3"></section>

                                        <section className="d-flex justify-content-between align-items-center">
                                            <p className="text-muted">مبلغ قابل پرداخت</p>
                                            <p className="fw-bold">{payabbleAmount.toLocaleString()} تومان</p>
                                        </section>

                                        <section className="">
                                            {/* <section id="payment-button" className="text-warning border border-warning text-center py-2 pointer rounded-2 d-block">نوع پرداخت را انتخاب کن</section>
                                            <a id="final-level" href="my-orders.html" className="btn btn-danger d-none">ثبت سفارش و گرفتن کد رهگیری</a> */}
                                            <button className='mt-3' onClick={handleOrderSubmit} disabled={loading}>
                                                {loading ? 'در حال پردازش...' : 'ثبت سفارش'}
                                            </button>
                                        </section>

                                    </section>
                                </section>
                            </section>
                        </section>
                    </section>

                </section>
            </section>
            {/*  end cart  */}

        </main>
    );
};

