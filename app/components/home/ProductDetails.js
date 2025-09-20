import React from 'react';

const ProductDetails = ({name, description, stock, category}) => {
    
    return (
        <section className="content-wrapper bg-white p-3 rounded-2 mb-4">                   
            <section className="content-header mb-3">
                <section className="d-flex justify-content-between align-items-center">
                    <h2 className="content-header-title content-header-title-small">
                        {name}
                    </h2>
                    <section className="content-header-link">
                        <a href="#">مشاهده همه</a>
                    </section>
                </section>
            </section>
            <section className="product-info">

                {/* <p><span>رنگ : قهوه ای</span></p>
                <p>
                    <span style={{backgroundColor: "#523e02"}} className="product-info-colors me-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="قهوه ای تیره"></span>
                    <span style={{backgroundColor: "#0c4128"}} className="product-info-colors me-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="سبز یشمی"></span>
                    <span style={{backgroundColor: "#fd7e14"}} className="product-info-colors me-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="نارنجی پرتقالی"></span>
                </p> */}
                <p><i className="fa fa-shield-alt cart-product-selected-warranty me-1"></i> <span> گارانتی اصالت و سلامت فیزیکی کالا</span></p>
                <p><i className="fa fa-store-alt cart-product-selected-store me-1"></i> 
                    {stock > 0 ? <span>{`کالا موجود در انبار - موجودی: ${stock}`}</span> : <span>کالا موجود نیست</span>}
                </p>
                {/* <p><a className="btn btn-light  btn-sm text-decoration-none" href="#"><i className="fa fa-heart text-danger"></i> افزودن به علاقه مندی</a></p> */}
                <p>
                    <span>دسته بندی: {category.name}</span>
                </p>
                {/* <section>
                    <section className="cart-product-number d-inline-block ">
                        <button className="cart-number-down" type="button">-</button>
                        <input className="" type="number" min="1" max="5" step="1" value="1" readOnly="readOnly"/>
                        <button className="cart-number-up" type="button">+</button>
                    </section>
                </section> */}
                <p className="mb-3 mt-5">
                    <i className="fa fa-info-circle me-1"></i>
                    {description}
                </p>
            </section>
        </section>
    );
};

export default ProductDetails;