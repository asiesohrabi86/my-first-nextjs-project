import Link from 'next/link';
import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaBox, FaComment, FaHome, FaPercent, FaStore, FaStoreAlt, FaStoreAltSlash, FaTags, FaUser } from 'react-icons/fa';
import { BiLogoProductHunt } from "react-icons/bi";

const Sidebar = () => {
    return (
        <aside className='sidebar'>
            <Nav className='flex-column mt-3'>
                {/* <Nav.Link href="#home">Home</Nav.Link> */}
                <Link href='/admin'>
                    <FaHome/>داشبورد
                </Link>
                <Link href='/admin/categories'>
                    <FaTags/>دسته بندی ها
                </Link>
                <Link href='/admin/products'>
                    {/* <BiLogoProductHunt />محصولات */}
                    <FaBox />محصولات
                </Link>
                <Link href='/admin/discounts'>
                    <FaPercent />مدیریت کدهای تخفیف
                </Link>
                <Link href='/admin/comments'>
                    <FaComment />مدیریت نظرات
                </Link>
                <Link href='/admin/store'>
                    <FaStore />مدیریت انبار موجودی
                </Link>
                <Link href='/admin/users'>
                    <FaUser />مدیریت کاربران
                </Link>
                <Link href='/admin/slideShows'>
                    <FaUser />مدیریت اسلایدشو
                </Link>
                <Link href='/admin/adsBrands'>
                    <FaUser />مدیریت برندهای تبلیغاتی
                </Link>
                <Link href='/admin/brands'>
                    <FaUser />مدیریت برندها
                </Link>
            </Nav>
        </aside>
    );
};

export default Sidebar;