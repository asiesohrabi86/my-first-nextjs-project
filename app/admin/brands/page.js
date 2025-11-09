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
import { getBrands } from '../lib/getBrands';
import { useSearchParams } from 'next/navigation';

const Brands = () => {
    const [brands, setBrands] = useState([]);
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
        const fetchBrands = async () => {
            try {
                const data = await getBrands();
                if (!Array.isArray(data)) {
                    throw new Error("داده های دریافتی معتبر نمی باشند");
                    
                }
                setBrands(data);
                
            } catch (error) {
                setError(`${error}  خطا`);
            }finally{
                setLoading(false);
            }
        }
        fetchBrands();
    }, []);

const handleDelete = async (id) => {
    setLoading(true);
    try {
        const response = await fetch(`/api/brands/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            setError('خطا در حذف برند');
        }

        const {message} = await response.json();
        setMsg(message);
        setTimeout(() => {
            setMsg("");
        }, 3000);

        setBrands(brands.filter(brand => brand._id != id));

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
                            <h4>مدیریت برندها</h4>
                            {error && <GeneralError error={error}/>}
                            {loading ? <LoadingSpinner/> : (
                                <>
                                    <Link href="brands/add" className='btn-custom-add mb-3 px-2 py-1 rounded'>
                                        <AiOutlinePlus/>
                                        افزودن
                                    </Link>
                                    <Table striped hover bordered>
                                        <thead>
                                            <tr>
                                                <th>شناسه</th>
                                                <th>عکس</th>
                                                <th>نام برند</th>
                                                <th>عملیات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {brands.map((brand, index) => 
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <Image src={brand.imageUrl} alt='' width={80} height={50}/>
                                                    </td>
                                                    <td>{brand.name}</td>
                                                    <td>
                                                        <div className='btn-group-inline'>
                                                            <Link href={`/admin/brands/${brand._id}`} className='btn-custom-edit rounded'>
                                                                <AiOutlineEdit/>
                                                            </Link>
                                                            <button onClick={() => handleDelete(brand._id)} className='btn-custom-delete rounded'>
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

export default Brands;