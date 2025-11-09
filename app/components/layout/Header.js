"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useEffect } from "react";
import { getCategories } from "@/app/home/lib/getCategories";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { signOut } from "next-auth/react";
import AuthWrapper from "../auth/Auth";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const {cart} = useCart();

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.log(`${error} خطا`);
        
      }finally{
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);
  return (
    <header className="header mb-4">
      <section className="top-header">
        <section className="container-xxl ">
          <section className="d-md-flex justify-content-md-between align-items-md-center py-3">
            <section className="d-flex justify-content-between align-items-center d-md-block">
              <a className="text-decoration-none" href="index.html">
                <Image
                  src="/images/logo/8.png"
                  alt="Logo"
                  width={80}
                  height={50}
                  priority
                />
              </a>
              <button
                className="btn btn-link text-dark d-md-none"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasExample"
                aria-controls="offcanvasExample"
              >
                <i className="fa fa-bars me-1"></i>
              </button>
            </section>

            <section className="mt-3 mt-md-auto search-wrapper">
              <section className="search-box">
                <section className="search-textbox">
                  <span>
                    <i className="fa fa-search"></i>
                  </span>
                  <input
                    id="search"
                    type="text"
                    className=""
                    placeholder="جستجو ..."
                    autoComplete="off"
                  />
                </section>
                <section className="search-result visually-hidden">
                  <section className="search-result-title">
                    نتایج جستجو برای{" "}
                    <span className="search-words">"موبایل شیا"</span>
                    <span className="search-result-type">در دسته بندی ها</span>
                  </section>
                  <section className="search-result-item">
                    <a className="text-decoration-none" href="#">
                      <i className="fa fa-link"></i> دسته موبایل و وسایل جانبی
                    </a>
                  </section>

                  <section className="search-result-title">
                    نتایج جستجو برای{" "}
                    <span className="search-words">"موبایل شیا"</span>
                    <span className="search-result-type">در برندها</span>
                  </section>
                  <section className="search-result-item">
                    <a className="text-decoration-none" href="#">
                      <i className="fa fa-link"></i> برند شیائومی
                    </a>
                  </section>
                  <section className="search-result-item">
                    <a className="text-decoration-none" href="#">
                      <i className="fa fa-link"></i> برند توشیبا
                    </a>
                  </section>
                  <section className="search-result-item">
                    <a className="text-decoration-none" href="#">
                      <i className="fa fa-link"></i> برند شیانگ پینگ
                    </a>
                  </section>

                  <section className="search-result-title">
                    نتایج جستجو برای{" "}
                    <span className="search-words">"موبایل شیا"</span>
                    <span className="search-result-type">در کالاها</span>
                  </section>
                  <section className="search-result-item">
                    <span className="search-no-result">موردی یافت نشد</span>
                  </section>
                </section>
              </section>
            </section>

            <section className="mt-3 mt-md-auto text-end">
              <section className="d-inline px-md-3">
                <AuthWrapper>
                  <button
                    className="btn btn-link text-decoration-none text-dark dropdown-toggle profile-button"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa fa-user"></i>
                  </button>
                  <section
                    className="dropdown-menu dropdown-menu-end custom-drop-down"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <section>
                      <a className="dropdown-item" href="/my-profile">
                        <i className="fa fa-user-circle"></i>پروفایل کاربری
                      </a>
                    </section>
                    <section>
                      <Link className="dropdown-item" href="/my-profile/my-orders">
                        <i className="fa fa-newspaper"></i>سفارشات
                      </Link>
                    </section>
                    <section>
                      <a className="dropdown-item" href="my-favorites.html">
                        <i className="fa fa-heart"></i>لیست علاقه مندی
                      </a>
                    </section>
                    <section>
                      <hr className="dropdown-divider" />
                    </section>
                    <section>
                      <button className="dropdown-item" onClick={() => signOut()}>
                        <i className="fa fa-sign-out-alt"></i>خروج
                      </button>
                    </section>
                  </section>
                </AuthWrapper>
              </section>
              <section className="header-cart d-inline ps-3 border-start position-relative">
                <Link
                  className="btn btn-link position-relative text-dark header-cart-link"
                  href="/cart"
                >
                  <i className="fa fa-shopping-cart"></i>{" "}
                  {totalItems > 0 && (<span
                    style={{ top: "80%" }}
                    className="position-absolute start-0 translate-middle badge rounded-pill bg-danger"
                  >
                    {totalItems}
                  </span>)}
                </Link>
                {/* <section className="header-cart-dropdown">
                  <section className="border-bottom d-flex justify-content-between p-2">
                    <span className="text-muted">{totalItems} کالا</span>
                    <a
                      className="text-decoration-none text-info"
                      href="cart.html"
                    >
                      مشاهده سبد خرید{" "}
                    </a>
                  </section>
                  <section className="header-cart-dropdown-body">
                    <section className="header-cart-dropdown-body-item d-flex justify-content-start align-items-center">
                      <Image
                        src="/images/products/1.jpg"
                        alt="Logo"
                        width={80}
                        height={50}
                        priority
                      />
                      <section className="w-100 text-truncate">
                        <a className="text-decoration-none text-dark" href="#">
                          کتاب اثر مرکب اثر دارن هاردی انتشارات معیار علم
                        </a>
                      </section>
                      <section className="flex-shrink-1">
                        <a
                          className="text-muted text-decoration-none p-1"
                          href="#"
                        >
                          <i className="fa fa-trash-alt"></i>
                        </a>
                      </section>
                    </section>

                    <section className="header-cart-dropdown-body-item d-flex justify-content-start align-items-center">
                      <Image
                        src="/images/products/2.jpg"
                        alt="Logo"
                        width={80}
                        height={50}
                        priority
                      />
                      <section className="w-100 text-truncate">
                        <a className="text-decoration-none text-dark" href="#">
                          دستگاه آبمیوه گیری دنویر با کد 1016
                        </a>
                      </section>
                      <section className="flex-shrink-1">
                        <a
                          className="text-muted text-decoration-none p-1"
                          href="#"
                        >
                          <i className="fa fa-trash-alt"></i>
                        </a>
                      </section>
                    </section>
                  </section>
                  <section className="header-cart-dropdown-footer border-top d-flex justify-content-between align-items-center p-2">
                    <section className="">
                      <section>مبلغ قابل پرداخت</section>
                      <section> 1,326,000 تومان</section>
                    </section>
                    <section className="">
                      <a
                        className="btn btn-danger btn-sm d-block"
                        href="cart.html"
                      >
                        ثبت سفارش
                      </a>
                    </section>
                  </section>
                </section> */}
              </section>
            </section>
          </section>
        </section>
      </section>

      <nav className="top-nav">
        <section className="container-xxl ">
          <nav className="">
            <section className="d-none d-md-flex justify-content-md-start position-relative">
              {loading ? <p>در حال بارگزاری...</p> : (
                categories.map(category => {
                  return (
                    <section className="navbar-item" key={category._id}>
                      <a href="#">{category.name}</a>
                    </section>
                  );
                })
              )} 
            </section>

            <section
              className="offcanvas offcanvas-start"
              tabIndex="-1"
              id="offcanvasExample"
              aria-labelledby="offcanvasExampleLabel"
              style={{ zIndex: "9999999" }}
            >
              <section className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasExampleLabel">
                  <Link href="/" className="text-decoration-none">
                    <Image
                      src="/images/logo/8.png"
                      alt="Logo"
                      width={80}
                      height={50}
                      priority
                    />
                  </Link>
                </h5>
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </section>
              <section className="offcanvas-body">
                <section className="navbar-item">
                  <a href="#">سوپرمارکت</a>
                </section>
                <section className="navbar-item">
                  <a href="#">تخفیف ها و پیشنهادها</a>
                </section>
                <section className="navbar-item">
                  <a href="#">آمازون من</a>
                </section>
                <section className="navbar-item">
                  <a href="#">آمازون پلاس</a>
                </section>
                <section className="navbar-item">
                  <a href="#">درباره ما</a>
                </section>
                <section className="navbar-item">
                  <a href="#">فروشنده شوید</a>
                </section>
                <section className="navbar-item">
                  <a href="#">فرصت های شغلی</a>
                </section>

                <hr className="border-bottom" />
                <section className="navbar-item">
                  <a href="javascript:void(0)">دسته بندی</a>
                </section>
                <section className="sidebar-nav mt-2 px-3">
                  <section className="sidebar-nav-item">
                    <span className="sidebar-nav-item-title">
                      کالای دیجیتال <i className="fa fa-angle-left"></i>
                    </span>
                    <section className="sidebar-nav-sub-wrapper">
                      <section className="sidebar-nav-sub-item">
                        <span className="sidebar-nav-sub-item-title">
                          <a href="#">لوازم جانبی موبایل</a>
                          <i className="fa fa-angle-left"></i>
                        </span>
                        <section className="sidebar-nav-sub-sub-wrapper">
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">هندزفری</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">هدست</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">اسپیکر موبایل</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">پاوربانک</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">هندزفری بیسیم</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">قاب موبایل</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">هولدر نگهدارنده</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">شارژر بیسیم</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">مونوپاد</a>
                          </section>
                        </section>
                      </section>
                      <section className="sidebar-nav-sub-item">
                        <span className="sidebar-nav-sub-item-title">
                          <a href="#">لوازم جانبی موبایل</a>
                          <i className="fa fa-angle-left"></i>
                        </span>
                        <section className="sidebar-nav-sub-sub-wrapper">
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">هندزفری</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">هدست</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">اسپیکر موبایل</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">پاوربانک</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">هندزفری بیسیم</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">قاب موبایل</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">هولدر نگهدارنده</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">شارژر بیسیم</a>
                          </section>
                          <section className="sidebar-nav-sub-sub-item">
                            <a href="#">مونوپاد</a>
                          </section>
                        </section>
                      </section>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </nav>
        </section>
      </nav>
    </header>
  );
};

export default Header;
