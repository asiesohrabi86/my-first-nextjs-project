import React from 'react';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { Col, Container, Row } from 'react-bootstrap';
import UpdateForm from './UpdateForm';
import AuthWrapper from '@/app/components/auth/Auth';
import { getBaseUrl } from '@/app/lib/utils';

const UpdateUser = async ({params}) => {
    const {id} = await params;
   
    const fetchUser = async () => {
        try{
            const baseURL = getBaseUrl();
            const response = await fetch(`${baseURL}/api/users/${id}`);
            const data = await response.json();
            return data;
        }catch(error){
            console.log("مشگلی در دریافت کاربر پیش آمده است");
        }
    }  

    const user = await fetchUser(); 
    return (
        <AuthWrapper>
            <Container fluid>
                <Row>
                    <Col md="2" className='vh-100'>
                        <Sidebar/>
                    </Col>
                    <Col md="10">
                        <Header/>
                        <UpdateForm user={user}/>
                    </Col>
                </Row>
            </Container>
        </AuthWrapper>
    );
};

export default UpdateUser;