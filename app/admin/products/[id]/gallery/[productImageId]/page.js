"use client";
import GeneralError from '@/app/components/ui/GeneralError';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row, Image } from 'react-bootstrap';
import AuthWrapper from '@/app/components/auth/Auth';
import { useSearchParams } from 'next/navigation';


const UpdateProductImage = ({params}) => {
    const {productImageId} = use(params);
    console.log(productImageId);
    
    const searchParams = useSearchParams();
    const product = searchParams.get('product');
    console.log(product);
    

    const [image, setImage] = useState(null);
      // برای نمایش عکس قبلی
    const [currentImage, setCurrentImage] = useState("");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProductImageData = async () => {
            setLoading(true);
            try{
                const productImageResponse = await fetch(`/api/products/${product}/gallery/${productImageId}`);
                if (!productImageResponse.ok) {
                    throw new Error("مشگلی در دریافت تصویر محصول پیش آمده است");  
                }
                const productImageData = await productImageResponse.json();
                
                setCurrentImage(productImageData.imageUrl);

            }catch(error){
                setError("مشگلی در دریافت تصویر محصول پیش آمده است");
            }
            finally{
                setLoading(false);
            } 
        };
        fetchProductImageData();   
    }, [product, productImageId]);

    
    const validateForm = () => {
        if (!product) {
            setFormError("انتخاب محصول الزامیست");
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
            if (image) {
                formData.append('image', image); 
            }
            
            const response = await fetch(`/api/products/${product}/gallery/${productImageId}`, {
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
                throw new Error("مشگلی در ویرایش تصویر محصول پیش آمد");
                
            }

            router.push(`/admin/products/${product}/gallery?msg=تصویر محصول با موفقیت ویرایش شد`);

        } catch (error) {
            const message = await response.json();
            setError(message.message);
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
                            <h2 className='my-4'>ویرایش تصویر محصول</h2>
                            {/* logical error */}
                            {error && <Alert variant='danger' error={error}/>}
                            {/* validation error */}
                            {formError && <Alert variant='warning'>{formError}</Alert>}
                            <Form onSubmit={handleSubmit} className='mb-3'>
                                <Form.Group className='mb-3'>
                                    <Form.Label>تصویر محصول</Form.Label>
                                    <Form.Control type='file' accept='image/*' onChange={e => setImage(e.target.files[0])}/>
                                    {currentImage && (<div><Image src={currentImage} alt="" style={{maxWidth: "200px", marginBottom: "10px"}}/></div>)}
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

export default UpdateProductImage;