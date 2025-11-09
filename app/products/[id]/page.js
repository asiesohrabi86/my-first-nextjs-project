import ProductDetails from '@/app/components/home/ProductDetails';
import ProductGallery from '@/app/components/home/ProductGallery';
import AddProductComments from '@/app/components/home/AddProductComments';
import RelatedProducts from '@/app/components/home/RelatedProducts';
import React from 'react';
import "../../styles/product.css";
import AddToCartButton from '@/app/components/home/AddToCartButton';
import { getBaseUrl } from "@/app/lib/utils";

async function getProductData(id) {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/products/home/${id}`,{
        cache: 'force-cache',
        next: {
            revalidate: 60
        }
    });
    if (!res.ok) {
        throw new Error("خطایی در دریافت اطلاعات");
        
    }
    return res.json();
}

const SingleProduct = async ({params}) => {
    const {id} = await params;

    const product = await getProductData(id);

    return (
        <main id='main-body-one-col' className='main-body'>
            <section className='container-xxl'>
                <section className='row'>
                    <section className='col-md-4'>
                        <ProductGallery id={id} images ={product.imageUrl}/>
                    </section>
                    <section className='col-md-5'>
                        <ProductDetails name={product.name} description={product.description} stock={product.stock} category={product.category}/>
                    </section>
                    <section className="col-md-3">
                        <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
                            <section className="d-flex justify-content-between align-items-center">
                                <p className="text-muted">قیمت کالا</p>
                                <p className="text-muted">{product.price.toLocaleString()} <span className="small">تومان</span></p>
                            </section>

                            <section className="d-flex justify-content-between align-items-center">
                                <p className="text-muted">تخفیف کالا</p>
                                <p className="text-danger fw-bolder">0 <span className="small">تومان</span></p>
                            </section>

                            <section className="border-bottom mb-3"></section>

                            <section className="d-flex justify-content-end align-items-center">
                                <p className="fw-bolder">{product.price.toLocaleString()} <span className="small">تومان</span></p>
                            </section>

                            <AddToCartButton productId={id}/>

                        </section>
                    </section>
                </section>
                <RelatedProducts categoryId={product.category._id}/>
                <AddProductComments id={product._id}/>
            </section>
        </main>
    );
};

export default SingleProduct;