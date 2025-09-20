"use client";
import { getProductComments } from '@/app/home/lib/getProductComments';
import React, { useEffect, useState } from 'react';

const ProductComments = ({productId}) => {
    const [productComments, setProductComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductComments = async () => {
            try {
                const data = await getProductComments(productId);
                if (!Array.isArray(data)) {
                throw new Error("داده های دریافتی معتبر نمی باشند");
                    
                }
                setProductComments(data);

            } catch (error) {
                setError(error);
              }finally{
                setLoading(false);
              }

        }
        fetchProductComments();
    }, [productId]);

    if (loading) return <p>در حال دریافت اطلاعات...</p>;
    if (error) return <p>خطایی رخ داده است...</p>;

    return (
        <div>
            {productComments.length == 0 && <section className="product-comment" >
                        <section className="product-comment-header d-flex justify-content-start">
                            <section className="product-comment-title">برای این محصول دیدگاهی ثبت نشده است</section>
                        </section>
                    </section>}
            {productComments.map(productComment => {
                return (
                    <section className="product-comment" key={productComment._id}>
                        <section className="product-comment-header d-flex justify-content-start">
                            <section className="product-comment-date">{new Date(productComment.createdAt).toLocaleDateString('fa-IR')}</section>
                            <section className="product-comment-title">{productComment.userId.name}</section>
                        </section>
                        <section className="product-comment-body">
                        {productComment.comment}
                        </section>
                    </section>
                );
            })}
        </div>
    );
};

export default ProductComments;