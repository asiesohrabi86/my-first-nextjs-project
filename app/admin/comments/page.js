"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { Col, Container, Row} from 'react-bootstrap';
import CommentsLists from './CommentsLists';
import AuthWrapper from '@/app/components/auth/Auth';


const Comments =  () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        // این تابع در مرورگر کاربر اجرا می‌شود
        const getData = async () => {
            try{
                const response = await fetch('/api/comments');

                if (!response.ok) {
                    throw new Error('مشکل در دریافت نظرات');
                }

                const data = await response.json();
                setComments(data);
            }catch(error){
                console.log(error);
                throw new Error('مشکل در دریافت نظرات');
            } finally {
                setLoading(false);
            } 
        }
        getData();
    }, []);

    if (loading) {
        return <div>در حال بارگذاری نظرات...</div>;
    }
    if (error) {
        return <div>خطا: {error}</div>;
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
                        <CommentsLists comments={comments}/>        
                    </Col>
                </Row>
            </Container>
        </AuthWrapper>
    ) 
};

export default Comments;