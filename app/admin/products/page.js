"use client";
import AuthWrapper from '@/app/components/auth/Auth';
import GeneralError from '@/app/components/ui/GeneralError';
import Header from '@/app/components/ui/Header';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Sidebar from '@/app/components/ui/Sidebar';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Alert, Col, Container, Row, Table, Image } from 'react-bootstrap';
import {AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineFileImage} from "react-icons/ai";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const searchParams = useSearchParams();

    useEffect(() => {
        setMsg(searchParams.get('msg'));
        setTimeout(() => {
            setMsg("");  
        }, 3000);
    }, [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/products");
                if (!response.ok) {
                    throw new Error("مشگل در دریافت محصولات");
                    
                }
                const data = await response.json();
                setProducts(data);
                } catch (error) {
                    setError(error.message);
                }finally{
                    setLoading(false);
                }
        };

        fetchProducts();
    }, []);

    const handleDelete = async(id) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept" : "application/json"
                }
            });
    
            const {message} = await response.json();
            setMsg(message);

            setProducts(products.filter(product => product._id !== id));

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
                            <h4>مدیریت محصولات</h4>
                            {error && <GeneralError error={error}/>}
                            {loading ? <LoadingSpinner/> : (
                                <>
                                    <Link href="products/add" className='btn-custom-add mb-3 px-2 py-1 rounded'>
                                        <AiOutlinePlus/>
                                        افزودن
                                    </Link>
                                    <Table striped hover bordered>
                                        <thead>
                                            <tr>
                                                <th>شناسه</th>
                                                <th>نام</th>
                                                <th>توضیحات</th>
                                                <th>دسته بندی</th>
                                                <th>تصویر</th>
                                                <th>قیمت</th>
                                                <th>موجودی</th>
                                                <th>عملیات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product, index) => 
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{product.name}</td>
                                                    <td>{product.description}</td>
                                                    <td>{product.category?.name || "فاقد دسته بندی"}</td>
                                                    <td>
                                                        <Image src={product.imageUrl} width="50" height="50"/>
                                                    </td>
                                                    <td>{product.price}</td>
                                                    <td>{product.stock}</td>
                                                    <td>
                                                        <div className='btn-group-inline'>
                                                            <Link href={`/admin/products/${product._id}`} className='btn-custom-edit rounded'>
                                                                <AiOutlineEdit/>
                                                            </Link>
                                                            <button onClick={() => handleDelete(product._id)} className='btn-custom-delete rounded'>
                                                                <AiOutlineDelete/>
                                                            </button>
                                                            <Link href={`/admin/products/${product._id}/gallery`} className='btn-custom-gallery rounded'>
                                                                <AiOutlineFileImage/>
                                                            </Link>
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

export default Products;