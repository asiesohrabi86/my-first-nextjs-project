"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import "@/app/styles/cart.css";

export default function Cart(){
    const {cart, removeFromCart, increaseQuantity, decreaseQuantity, error} = useCart();
    const [loadingItem, setLoadingItem] = useState(null);

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
    return (
        <main id="main-body-one-col" className="main-body">

        {/* start cart */}
        <section className="mb-4">
            <section className="container-xxl" >
                <section className="row">
                    <section className="col">
                        {/* start vontent header  */}
                        <section className="content-header">
                            <section className="d-flex justify-content-between align-items-center">
                                <h2 className="content-header-title">
                                    <span>سبد خرید شما</span>
                                </h2>
                                <section className="content-header-link">
                                    {/* <a href="#">مشاهده همه</a> */}
                                </section>
                            </section>
                        </section>

                        <section className="row mt-4">
                            <section className="col-md-9 mb-3">
                                <section className="content-wrapper bg-white p-3 rounded-2">
                                    {error && <span className="text-danger">{error}</span>}
                                    {cart.items.map(item => {
                                        return (
                                            <section className="cart-item d-md-flex py-3" key={item.product?._id || item._id}>
                                                <section className="cart-img align-self-start flex-shrink-1">
                                                    {item.product?.imageUrl ? 
                                                    (<Image src={item.product?.imageUrl} width={80} height={80} alt="item.product?.name"/>)
                                                    : <span>تصویر موجود نیست</span>}    
                                                </section>
                                                <section className="align-self-start w-100">
                                                    <p className="fw-bold">{item.product?.name || 'محصول نامشخص'}</p>
                                                    {/* <p><span style="background-color: #523e02;" className="cart-product-selected-color me-1"></span> <span> قهوه ای</span></p>
                                                    <p><i className="fa fa-shield-alt cart-product-selected-warranty me-1"></i> <span> گارانتی اصالت و سلامت فیزیکی کالا</span></p>
                                                    <p><i className="fa fa-store-alt cart-product-selected-store me-1"></i> <span>کالا موجود در انبار</span></p> */}
                                                    <section>
                                                        <section className="cart-product-number d-inline-block ">
                                                            <button className="cart-number-down" type="button"
                                                             disabled={item.quantity <= 1 || loadingItem === item.product?._id}
                                                             onClick={async () => {
                                                                setLoadingItem(item.product?._id);
                                                                await decreaseQuantity(item.product?._id);
                                                                setLoadingItem(null);
                                                             }}>{loadingItem === item.product?._id ? '...' : '-'}</button>
                                                            <input className="" type="number" min="1" max="5" step="1" value={item.quantity} readOnly/>
                                                            <button className="cart-number-up" type="button" disabled={item.quantity >= (item.product?.stock)
                                                            || 0 || loadingItem === item.product?._id}
                                                             onClick={async () => {
                                                                setLoadingItem(item.product?._id);
                                                                await increaseQuantity(item.product?._id);
                                                                setLoadingItem(null);
                                                            }}>{loadingItem === item.product?._id ? '...' : '+'}</button>
                                                        </section>
                                                        <a className="text-decoration-none ms-4 cart-delete" onClick={(e) => {
                                                            e.preventDefault();
                                                            removeFromCart(item.product?._id);
                                                        }}><i className="fa fa-trash-alt"></i> حذف</a>
                                                    </section>
                                                </section>
                                                <section className="align-self-end flex-shrink-1">
                                                    <section className="text-nowrap fw-bold">{item.product?.price.toLocaleString()} تومان</section>
                                                </section>
                                            </section>
                                        );
                                    })}

                                </section>
                            </section>
                            <section className="col-md-3">
                                <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
                                    <section className="d-flex justify-content-between align-items-center">
                                        <p className="text-muted">قیمت کالاها ({cart.items.length})</p>
                                        <p className="text-muted">{cart?.items?.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0).toLocaleString()} تومان</p>
                                    </section>

                                    {/* <section className="d-flex justify-content-between align-items-center">
                                        <p className="text-muted">تخفیف کالاها</p>
                                        <p className="text-danger fw-bolder">78,000 تومان</p>
                                    </section> */}
                                    <section className="border-bottom mb-3"></section>
                                    <section className="d-flex justify-content-between align-items-center">
                                        <p className="text-muted">جمع سبد خرید</p>
                                        <p className="fw-bolder">{cart?.items?.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0).toLocaleString()} تومان</p>
                                    </section>

                                    {/* <p className="my-3">
                                        <i className="fa fa-info-circle me-1"></i>کاربر گرامی  خرید شما هنوز نهایی نشده است. برای ثبت سفارش و تکمیل خرید باید ابتدا آدرس خود را انتخاب کنید و سپس نحوه ارسال را انتخاب کنید. نحوه ارسال انتخابی شما محاسبه و به این مبلغ اضافه شده خواهد شد. و در نهایت پرداخت این سفارش صورت میگیرد.
                                    </p> */}


                                    <section className="">
                                        <Link href="/checkout" className="btn btn-danger d-block">تکمیل فرآیند خرید</Link>
                                    </section>

                                </section>
                            </section>
                        </section>
                    </section>
                </section>

            </section>
        </section>
         {/* end cart --> */}

        </main>
    );
};