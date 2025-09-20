import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/ui/Sidebar';
import Header from '../components/ui/Header';
import AuthWrapper from '@/app/components/auth/Auth';

const AdminDashboard = () => {
    console.log('ok');
    return (
        <AuthWrapper>
            <Container fluid>
                <Row>
                    <Col md={2} className="vh-100">
                        <Sidebar/>
                    </Col>
                    <Col md="10">
                        <Header/>
                        <main className='content p-4'>
                            <h4>به پنل ادمین خوش آمدید</h4>
                            <p>در این بخش می توانید موارد مختلف فروشگاه را مدیریت کنید</p>
                        </main>
                    </Col>
                </Row>
            </Container>
        </AuthWrapper>
    );
};

export default AdminDashboard;