"use client";
import React from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

const ProfileSidebar = () => {
    return (
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
    );
};

export default ProfileSidebar;
