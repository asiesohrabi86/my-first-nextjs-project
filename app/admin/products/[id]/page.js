"use client";
import GeneralError from '@/app/components/ui/GeneralError';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row, Image } from 'react-bootstrap';
import AuthWrapper from '@/app/components/auth/Auth';


const UpdateProduct = ({params}) => {
    const {id} = use(params);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState(null);
    // برای ذخیره عکسی که از محصول بدست میاوریم
    const [currentImage, setCurrentImage] = useState("");
    const [category, setCategory] = useState("");
    // برای نمایش دسته بندی های واکشی شده از دیتابیس در تگ سلکت:
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProductData = async (params) => {
            setLoading(true);
            try{
                const productResponse = await fetch(`/api/products/${id}`);
                const productData = await productResponse.json();
                setName(productData.name);
                setDescription(productData.description);
                setPrice(productData.price);
                setStock(productData.stock);
                setCategory(productData.category);
                setCurrentImage(productData.imageUrl);

                const categoriesResponse = await fetch("/api/categories");
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);
                
            }catch(error){
                setError("مشگلی در دریافت محصول پیش آمده است");
            }
            finally{
                setLoading(false);
            } 
        };
        fetchProductData();   
    }, [id]);

    
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
            if (image) {
                formData.append('image', image); 
            }
            
            const response = await fetch(`/api/products/${id}`, {
                method: "PUT",
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
                throw new Error("مشگلی در ویرایش محصول پیش آمد");
                
            }

            router.push("/admin/products?msg=محصول با موفقیت ویرایش شد");

        } catch (error) {
            const message = await response.json();
            setError(message .message);
        }finally{
            setLoading(false);
        }
    }
    if (loading) {
        return <LoadingSpinner/>
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
                            <h2 className='my-4'>ویرایش محصول</h2>
                            {/* logical error */}
                            {error && <Alert variant='danger' error={error}/>}
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
                                    <Form.Control type='file' accept='image/*' onChange={e => setImage(e.target.files[0])}/>
                                    {currentImage && (<div><Image src={currentImage} alt={name} style={{maxWidth: "200px", marginBottom: "10px"}}/></div>)}
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
                                            <option key={cat._id} value={cat._id} >{cat.name}</option>
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

export default UpdateProduct;