import React from 'react';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { Col, Container, Row} from 'react-bootstrap';
import UsersList from "@/app/admin/users/UsersList";
import AuthWrapper from '@/app/components/auth/Auth';
import { getBaseUrl } from '@/app/lib/utils';

const getData = async () => {
    try{
        const baseURL = getBaseUrl();
        const response = await fetch(`${baseURL}/api/users`);
        if (!response.ok) {
            throw new Error('مشکل در دریافت کاربران');
        }
        const data = await response.json();
        return data;
    }catch(error){
        throw new Error('مشکل در دریافت کاربران');
    }  
}

const Users = async () => {
    const users = await getData();
    return (
        <AuthWrapper>
            <Container fluid>
                <Row>
                    <Col md="2" className='vh-100'>
                        <Sidebar/>
                    </Col>
                    <Col md="10">
                        <Header/>
                        <UsersList users={users}/>        
                    </Col>
                </Row>
            </Container>
        </AuthWrapper>
    ) 
};

export default Users;