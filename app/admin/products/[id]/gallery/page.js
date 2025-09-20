"use client";
import { getProductImages } from '@/app/admin/lib/getProductImages';
import AuthWrapper from '@/app/components/auth/Auth';
import GeneralError from '@/app/components/ui/GeneralError';
import Header from '@/app/components/ui/Header';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Sidebar from '@/app/components/ui/Sidebar';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import { Alert, Col, Container, Row, Table, Image } from 'react-bootstrap';
import {AiOutlineDelete, AiOutlineEdit, AiOutlinePlus} from "react-icons/ai";

const ProductGallery = ({params}) => {
    const {id} = use(params);
    
    const [productImages, setProductImages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");
    const searchParams = useSearchParams();

    useEffect(() => {
        setMsg(searchParams.get('msg'));
        setTimeout(() => {
            setMsg("");  
        }, 3000);
    }, [searchParams]);

    useEffect(() => {
        const fetchProductImages = async () => {
            try {
                const data = await getProductImages(id);
                if (!Array.isArray(data)) {
                    throw new Error("داده های دریافتی معتبر نمی باشند");
                    
                }
                setProductImages(data);
                
            } catch (error) {
                setError(`${error}  خطا`);
            }finally{
                setLoading(false);
            }
        };

        fetchProductImages();
    }, []);

    const handleDelete = async(imageId) => {
        try {
            const response = await fetch(`/api/products/${id}/gallery/${imageId}`, {
                method: "DELETE",
                headers: {
                    "Accept" : "application/json"
                }
            });
    
            const {message} = await response.json();
            setMsg(message);

            setProductImages(productImages.filter(productImage => productImage._id !== imageId));

            setTimeout(() => {
                setMsg("");
            }, 3000);

        } catch (error) {
            setError("مشگلی در حذف پیش آمد");
        }
    }
    
    return (
        <AuthWrapper>
            <Container fluid>
                <Row>
                    <Col md="2" className='vh-100'>
                        <Sidebar/>
                    </Col>
                    <Col md="10">
                        <Header/>
                        <main className='p-4'>
                            {msg && <Alert variant='success'>{msg}</Alert>}
                            <h4>مدیریت گالری محصول</h4>
                            {error && <GeneralError error={error}/>}
                            {loading ? <LoadingSpinner/> : (
                                <>
                                    <Link href={`/admin/products/${id}/gallery/add?product=${id}`} className='btn-custom-add mb-3 px-2 py-1 rounded'>
                                        <AiOutlinePlus/>
                                        افزودن
                                    </Link>
                                    <Table striped hover bordered>
                                        <thead>
                                            <tr>
                                                <th>شناسه</th>
                                                <th> نام محصول</th>
                                                <th>تصویر</th>
                                                <th>عملیات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productImages.map((productImage, index) => 
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{productImage.product.name}</td>
                                                    <td>
                                                        <Image src={productImage.imageUrl} height={100} width={100}/>
                                                    </td>
                                                    <td>
                                                        <div className='btn-group-inline'>
                                                            <Link href={`/admin/products/${id}/gallery/${productImage._id}?product=${id}`} className='btn-custom-edit rounded'>
                                                                <AiOutlineEdit/>
                                                            </Link>
                                                            <button onClick={() => handleDelete(productImage._id)} className='btn-custom-delete rounded'>
                                                                <AiOutlineDelete/>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </>
                            )}
                        </main>
                    </Col>
                </Row>
            </Container>
        </AuthWrapper>
    );
};

export default ProductGallery;