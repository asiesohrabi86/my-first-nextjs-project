"use client";
import AuthWrapper from '@/app/components/auth/Auth';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import Image from 'next/image';

const UpdateSlideShow = ({params}) => {
    const {id} = use(params);

    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState("");
    const router = useRouter();
    const [currentImage, setCurrentImage] = useState("");

    useEffect(() => {
        const fetchSlideshow = async () => {
            const res = await fetch(`/api/slideShows/${id}`)
            .then(res => res.json())
            .then(result => {
                setCurrentImage(result.imageUrl);
                setUrl(result.url);
            })
            .catch(error => setError(error.message)); 
        }

        fetchSlideshow();
          
    }, [id]);

    const validateForm = () => {

        if (!url || url.trim() === "" || typeof url !== "string") {
            setFormError("لینک اسلایدشو الزامیست");
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
           return; 
        }

        try{
            const formData = await new FormData();
            if (image) {
                formData.append('image', image); 
            }
            formData.append('url', url);

            const res = await fetch(`/api/slideShows/${id}`,{
                method: "PUT",
                headers: {
                    "Content_Type": "application/json"
                },
                body: formData,

            });
            if (res.status === 400) {
                let message = await res.json();
                setFormError(message.message);
            }

            if(!res.ok){
                throw new Error("مشگلی در ویرایش اسلایدشو پیش آمده است");
            }

            router.push('/admin/slideShows?msg=اسلایدشو با موفقیت ویرایش شد');

        }catch(error){
            setError(error.message);
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
                            <h2 className='my-4'>ویرایش اسلایدشو </h2>
                            {/* logical error */}
                            {error && <Alert variant='danger'>{error}</Alert>}
                            {/* validation error */}
                            {formError && <Alert variant='warning'>{formError}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className='mb-3'>
                                    <Form.Label>عکس اسلایدشو</Form.Label>
                                    <Form.Control type="file" accept="image/*" onChange={(e)=>setImage(e.target.files[0])}/>
                                    {currentImage && <Image className="mt-2" src={currentImage} width={200} height={100} alt="عکس اسلایدشو"/>}
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>لینک اسلایدشو</Form.Label>
                                    <Form.Control value={url} onChange={(e)=>setUrl(e.target.value)} type='text' placeholder='لینک اسلایدشو..'/>
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

export default UpdateSlideShow;