"use client";
import AuthWrapper from '@/app/components/auth/Auth';
import GeneralError from '@/app/components/ui/GeneralError';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';

const AddProductImage = () => {
    const searchParams = useSearchParams();
    const productId = searchParams.get('product');
    console.log(productId);
    const [image, setImage] = useState(null);
    const [product, setProduct] = useState(productId);
    
    
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const validateForm = () => {
        if (!product) {
            setFormError("انتخاب محصول الزامیست");
            return false;
        }

        if (!image) {
            setFormError("انتخاب تصویر الزامیست");
            return false;
        }

        setFormError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('product', product);
            formData.append('image', image);
            const response = await fetch(`/api/products/${product}/gallery`, {
                method: "POST",
                headers: {
                    "Content_Type": "application/json"
                },
                body: formData,
            });
            if (response.status == 400) {
                const error = await response.json();
                setFormError(error.message);
            }

            if(!response.ok){
                throw new Error("مشگلی در ساخت تصویر محصول پیش آمد");
                
            }

            router.push(`/admin/products/${product}/gallery?msg=تصویر محصول با موفقیت ثبت شد`);

        } catch (error) {
            // const message = await response.json();
            setError(error .message);
        }finally{
            setLoading(false);
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
                            <h2 className='my-4'>افزودن تصویر محصول</h2>
                            {/* logical error */}
                            {error && <Alert variant='danger'>{error}</Alert>}
                            {/* validation error */}
                            {formError && <Alert variant='warning'>{formError}</Alert>}
                            <Form onSubmit={handleSubmit} className='mb-3'>
                                <Form.Group className='mb-3'>
                                    <Form.Label>تصویر محصول</Form.Label>
                                    <Form.Control type='file' accept='image/*' onChange={e => setImage(e.target.files[0])} required/>
                                </Form.Group>
                                <Button type='submit'>ذخیره</Button>
                            </Form>
                        </main>
                    </Col>
                </Row>
            </Container>
        </AuthWrapper>
    );
};

export default AddProductImage;