import React from 'react';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { Col, Container, Row} from 'react-bootstrap';
import StoreList from "@/app/admin/store/StoreList";
import AuthWrapper from '@/app/components/auth/Auth';

const getData = async () => {
    try{
        const response = await fetch('http://localhost:3000/api/products', {
            cache: 'force-cache',
            next: {
                revalidate: 3600,
            },
        });

        if (!response.ok) {
            throw new Error('مشکل در دریافت محصولات');
        }

        const data = await response.json();
        return data;
    }catch(error){
        throw new Error('مشکل در دریافت محصولات');
    } 
 
}

const Store = async () => {
    const products = await getData();
    return (
        <AuthWrapper>
            <Container fluid>
                <Row>
                    <Col md="2" className='vh-100'>
                        <Sidebar/>
                    </Col>
                    <Col md="10">
                        <Header/>
                        <StoreList products={products}/>   
                    </Col>
                </Row>
            </Container>
        </AuthWrapper>
    ) 
};

export default Store;