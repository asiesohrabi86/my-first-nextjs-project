"use client";
import AuthWrapper from '@/app/components/auth/Auth';
import GeneralError from '@/app/components/ui/GeneralError';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';

const AddProduct = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState("");
    // برای نمایش دسته بندی های واکشی شده از دیتابیس در تگ سلکت:
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/categories")
            .then(response => response.json())
            .then(result => setCategories(result))
            .catch(error => setError("مشگلی در دریافت دسته بندی ها رخ داده است"));
        
    }, []);

    
    const validateForm = () => {
        if (!name || name.trim() == "") {
            setFormError("نام محصول الزامیست");
            return false;
        }else if (name.length < 3 || name.length > 30) {
            setFormError("نام محصول بین  3 تا 30 کاراکتر میباشد");
            return false;
        }

        if (!description || description.trim() == "") {
            setFormError("توضیحات محصول الزامیست");
            return false;
        }else if (description.length < 3 || description.length > 500) {
            setFormError("توضیحات محصول بین  3 تا 500 کاراکتر میباشد");
            return false;
        }

        if (price <= 0) {
            setFormError("قیمت محصول باید یک مقدار مثبت باشد");
            return false;
        }

        if (stock < 0) {
            setFormError("موجودی محصول باید یک مقدار مثبت باشد");
            return false;
        }

        if (!category) {
            setFormError("انتخاب دسته بندی الزامیست");
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
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('stock', stock);
            formData.append('category', category);
            formData.append('image', image);
            const response = await fetch("/api/products", {
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
                throw new Error("مشگلی در ساخت محصول پیش آمد");
                
            }

            router.push("/admin/products?msg=محصول با موفقیت ثبت شد");

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
                            <h2 className='my-4'>افزودن محصول</h2>
                            {/* logical error */}
                            {error && <Alert variant='danger'>{error}</Alert>}
                            {/* validation error */}
                            {formError && <Alert variant='warning'>{formError}</Alert>}
                            <Form onSubmit={handleSubmit} className='mb-3'>
                                <Form.Group className='mb-3'>
                                    <Form.Label>نام محصول</Form.Label>
                                    <Form.Control value={name} type='text' onChange={e => setName(e.target.value)} placeholder='نام محصول...' required/>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>توضیحات</Form.Label>
                                    <Form.Control value={description} type='text' onChange={e => setDescription(e.target.value)} placeholder='توضیحات...' required/>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>تصویر محصول</Form.Label>
                                    <Form.Control type='file' accept='image/*' onChange={e => setImage(e.target.files[0])} required/>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>قیمت</Form.Label>
                                    <Form.Control value={price} type='number' onChange={e => setPrice(e.target.value)} placeholder='30000' required/>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>موجودی</Form.Label>
                                    <Form.Control value={stock} type='number' onChange={e => setStock(e.target.value)} placeholder='3' required/>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>دسته بندی</Form.Label>
                                    <Form.Select value={category} onChange={e => setCategory(e.target.value)} required>
                                        <option value="">انتخاب دسته بندی</option>
                                        {categories && categories.map(cat => 
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        )}
                                        
                                    </Form.Select>
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

export default AddProduct;