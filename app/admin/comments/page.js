import React from 'react';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { Col, Container, Row} from 'react-bootstrap';
import CommentsLists from './CommentsLists';
import AuthWrapper from '@/app/components/auth/Auth';
import { getBaseUrl } from '@/app/lib/utils'; // مسیر را بر اساس ساختار پروژه تنظیم کنید

const getData = async () => {
    try{
        const baseURL = getBaseUrl();
        const response = await fetch(`${baseURL}/api/comments`);

        if (!response.ok) {
            throw new Error('مشکل در دریافت نظرات');
        }

        const data = await response.json();
        return data;
    }catch(error){
        console.log(error);
        throw new Error('مشکل در دریافت نظرات');
    } 
 
}

const Comments = async () => {
    const comments = await getData();
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