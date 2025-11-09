"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { Col, Container, Row} from 'react-bootstrap';
import UsersList from "@/app/admin/users/UsersList";
import AuthWrapper from '@/app/components/auth/Auth';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';


const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        const getData = async () => {
            try{
                const response = await fetch(`/api/users`);
                if (!response.ok) {
                    throw new Error('مشکل در دریافت کاربران');
                }
                const data = await response.json();
                setUsers(data);
            }catch(error){
                setError(error.message);
            }finally{
                setLoading(false);
            }  
        }
        getData();
    }, []);

    if(loading){
        return <LoadingSpinner/>;
    }

    if(error){
        return (<div className="text-danger">{error}</div>);
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
                        <UsersList users={users}/>        
                    </Col>
                </Row>
            </Container>
        </AuthWrapper>
    ) 
};

export default Users;