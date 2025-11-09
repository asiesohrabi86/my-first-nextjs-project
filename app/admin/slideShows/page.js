"use client";
import AuthWrapper from '@/app/components/auth/Auth';
import GeneralError from '@/app/components/ui/GeneralError';
import Header from '@/app/components/ui/Header';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Sidebar from '@/app/components/ui/Sidebar';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Alert, Col, Container, Row, Table } from 'react-bootstrap';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { getSlideShows } from '../lib/getSlideShows';
import { useSearchParams } from 'next/navigation';

const SlideShows = () => {
    const [slideShows, setSlideShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [msg, setMsg] = useState("");
    const searchParams = useSearchParams();

    useEffect(() => {
        const msg = searchParams.get('msg');
        setMsg(msg);
        setTimeout(() => {
            setMsg("");
        }, 3000);
    }, [searchParams]);

    useEffect(() => {
        const fetchSlideShows = async () => {
            try {
                const data = await getSlideShows();
                if (!Array.isArray(data)) {
                    throw new Error("داده های دریافتی معتبر نمی باشند");
                    
                }
                setSlideShows(data);
                
            } catch (error) {
                setError(`${error}  خطا`);
            }finally{
                setLoading(false);
            }
        }
        fetchSlideShows();
    }, []);

const handleDelete = async (id) => {
    setLoading(true);
    try {
        const response = await fetch(`/api/slideShows/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            setError('خطا در حذف اسلایدشو');
        }

        const {message} = await response.json();
        setMsg(message);
        setTimeout(() => {
            setMsg("");
        }, 3000);

        setSlideShows(slideShows.filter(slideShow => slideShow._id != id));

    } catch (error) {
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
                            {msg && <Alert variant='success'>{msg}</Alert>}
                            <h4>مدیریت اسلایدشو</h4>
                            {error && <GeneralError error={error}/>}
                            {loading ? <LoadingSpinner/> : (
                                <>
                                    <Link href="slideShows/add" className='btn-custom-add mb-3 px-2 py-1 rounded'>
                                        <AiOutlinePlus/>
                                        افزودن
                                    </Link>
                                    <Table striped hover bordered>
                                        <thead>
                                            <tr>
                                                <th>شناسه</th>
                                                <th>عکس</th>
                                                <th>لینک</th>
                                                <th>عملیات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {slideShows.map((slideShow, index) => 
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <Image src={slideShow.imageUrl} alt='' width={80} height={50}/>
                                                    </td>
                                                    <td>{slideShow.url}</td>
                                                    <td>
                                                        <div className='btn-group-inline'>
                                                            <Link href={`/admin/slideShows/${slideShow._id}`} className='btn-custom-edit rounded'>
                                                                <AiOutlineEdit/>
                                                            </Link>
                                                            <button onClick={() => handleDelete(slideShow._id)} className='btn-custom-delete rounded'>
                                                                <AiOutlineDelete/>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </>
                            )}
                        </main>
                    </Col>
                </Row>
            </Container>
        </AuthWrapper>
    );
};

export default SlideShows;