import Image from 'next/image';
import React from 'react';

const Footer = () => {
    return (
    <footer className="footer">
        <section className="container-xxl my-4">
            <section className="row">
                <section className="col">
                    <section className="footer-shop-features d-md-flex justify-content-md-around align-items-md-center">

                        <section className="footer-shop-features-item">
                            <Image src="/images/footer/1.png" width={80} height={50} alt="" />
                            <section className="text-center">امکان تحویل اکسپرس</section>
                        </section>

                        <section className="footer-shop-features-item">
                            <Image src="/images/footer/2.png" width={80} height={50} alt="" />
                            <section className="text-center">امکان پرداخت در محل</section>
                        </section>

                        <section className="footer-shop-features-item">
                            <Image src="/images/footer/3.png" width={80} height={50} alt="" />
                            <section className="text-center">7 روز هفته، 24 ساعته</section>
                        </section>

                        <section className="footer-shop-features-item">
                            <Image src="/images/footer/4.png" width={80} height={50} alt="" />
                            <section className="text-center">7 روز ضمانت بازگشت کالا</section>
                        </section>

                        <section className="footer-shop-features-item">
                            <Image src="/images/footer/5.png" width={80} height={50} alt="" />
                            <section className="text-center">ضمانت اصل بودن کالا</section>
                        </section>

                    </section>
                </section>
            </section>
            <section className="row">
                <section className="col-md">
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">شرایط و قوانین</a>
                    </section>
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">درباره ما</a>
                    </section>
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">تماس با ما</a>
                    </section>
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">فرصت های شغلی</a>
                    </section>
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">سوالات متداول</a>
                    </section>
                </section>

                <section className="col-md">
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">شرایط و قوانین</a>
                    </section>
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">درباره ما</a>
                    </section>
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">تماس با ما</a>
                    </section>
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">فرصت های شغلی</a>
                    </section>
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">سوالات متداول</a>
                    </section>
                </section>

                <section className="col-md">
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">شرایط و قوانین</a>
                    </section>
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">درباره ما</a>
                    </section>
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">تماس با ما</a>
                    </section>
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">فرصت های شغلی</a>
                    </section>
                    <section><a className="text-decoration-none text-muted d-inline-block my-2" href="#">سوالات متداول</a>
                    </section>
                </section>

                <section className="col-md-5">
                    <section>
                        <section className="text-dark fw-bold">با ما همراه باشید</section>
                        <section className="my-3">
                            <a href="#" className="text-muted text-decoration-none me-5"><i
                                    className="fab fa-instagram"></i></a>
                            <a href="#" className="text-muted text-decoration-none me-5"><i className="fab fa-telegram"></i></a>
                            <a href="#" className="text-muted text-decoration-none me-5"><i className="fab fa-whatsapp"></i></a>
                            <a href="#" className="text-muted text-decoration-none me-5"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="text-muted text-decoration-none me-5"><i className="fab fa-linkedin"></i></a>
                        </section>
                    </section>
                </section>
            </section>
            <section className="row my-5">
                <section className="col">
                    <section className="fw-bold">شرکت آمازون</section>
                    <section className="text-muted footer-intro">ما همواره تلاش می کنیم بهترین خدمات را به مشتریان آمازون
                        ارائه کنیم. به شما کمک می کنیم بهترین انتخاب را داشته باشید و با اطمینان خاطر خرید را انجام
                        بدهید و در کوتاه ترین زمان ممکن کالای خود را دریافت کنید. همچنین ما 24 ساعته در هفت روز هفته به
                        مشتریان مان خدمات ارائه می دهیم. و 7 روز ضمانت برگشت برای تمامی کالاها داریم.</section>
                </section>
            </section>

            <section className="row border-top pt-4">
                <section className="col">
                    <section className="text-muted footer-intro text-center">کلیه حقوق این وبسایت متعلق به شرکت آمازون می
                        باشد.</section>
                </section>
            </section>
        </section>
    </footer>
    );
};

export default Footer;