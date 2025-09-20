"use client";
import AuthWrapper from '@/app/components/auth/Auth';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';

const AddBrand = () => {
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateForm = () => {
        if (!image) {
            setFormError("عکس برند الزامیست");
            return false;
        }

        if (!name || name.trim() === "" || typeof name !== "string") {
            setFormError("نام برند الزامیست");
            return false;
        }
        return true;
    }

    const handleSubmit = async e => {
        
        e.preventDefault();
        setLoading(true);
        if (!validateForm()) {
            return;
        }
        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('name', name);

            const response = await fetch('/api/brands', {
                method: 'POST',
                headers: {
                    "Content_Type": "application/json"
                },
                body: formData
            });

            if (response.status == 400) {
                const error = await response.json();
                setFormError(error.message);
            }
            
            if (!response.ok) {
                throw new Error("مشگلی در ساخت برند پیش آمد");
            }

            router.push('/admin/brands?msg=برند با موفقیت ساخته شد');

        }catch(error){
            // const message = await response.json();
            setError(error.message);
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
                            <h2 className='my-4'>افزودن برند</h2>
                            {/* logical error */}
                            {error && <Alert variant='danger'>{error}</Alert>}
                            {/* validation error */}
                            {formError && <Alert variant='warning'>{formError}</Alert>}
                            <Form onSubmit={handleSubmit} className='mb-3'>
                                <Form.Group className='mb-3'>
                                    <Form.Label>عکس برند</Form.Label>
                                    <Form.Control type='file' accept='image/*' onChange={e => setImage(e.target.files[0])} required/>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>نام برند</Form.Label>
                                    <Form.Control value={name} type='text' onChange={e => setName(e.target.value)} placeholder='نام برند...' required/>
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

export default AddBrand;