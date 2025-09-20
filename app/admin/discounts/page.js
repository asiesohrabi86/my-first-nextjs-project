"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { Col, Container, Row} from 'react-bootstrap';
import AuthWrapper from '@/app/components/auth/Auth';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Alert, Table } from 'react-bootstrap';
import {AiOutlineDelete, AiOutlineEdit, AiOutlinePlus} from "react-icons/ai";
import GeneralError from '@/app/components/ui/GeneralError';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { getDiscounts } from '../lib/getDiscounts';


const Discounts = () => {
    const [discounts, setDiscounts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");
    const searchParams = useSearchParams();
    
    useEffect(() => {
        setMsg(searchParams.get('msg'));
        setTimeout(() => {
            setMsg("");  
        }, 3000);
    }, [searchParams]);
    
    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const data = await getDiscounts();
                if(!Array.isArray(data)){
                    setError("مشگلی در دریافت تخفیف هارخ داده است");
                }  
                console.log(data);
                
                setDiscounts(data);
            } catch (error) {
                setError(error);
            }finally{
                setLoading(false);
            }
        }
        fetchDiscounts();
    }, []);
    
    const handleDelete = async(id) => {
        try {
            const response = await fetch(`/api/discount-codes/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept" : "application/json"
                }
            });
    
            const {message} = await response.json();
            setMsg(message);

            setDiscounts(discounts.filter(discount => discount._id !== id));

            setTimeout(() => {
                setMsg("");
            }, 3000);

        } catch (error) {
            setError("مشگلی در حذف پیش آمد");
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
                        <h4>مدیریت کدهای تخفیف</h4>
                        {error && <GeneralError error={error}/>}
                        {loading ? <LoadingSpinner/> : (
                        <>
                            <Link href="discounts/add" className='btn-custom-add mb-3 px-2 py-1 rounded'>
                                <AiOutlinePlus/>
                                افزودن کد تخفیف جدید
                            </Link>
                            <Table striped hover bordered>
                                <thead>
                                    <tr>
                                        <th>شناسه</th>
                                        <th>کد تخفیف</th>
                                        <th>درصد تخفیف</th>
                                        <th>تاریخ انقضا</th>
                                        <th>وضعیت</th>
                                        <th>عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {discounts.map((discount, index) => 
                                        <tr key={index}>
                                            <td>{discount._id}</td>
                                            <td>{discount.code}</td>
                                            <td>% {discount.discountPercentage}</td>
                                            <td>
                                                {new Date(discount.expirationDate).toLocaleDateString('fa-IR')}
                                            </td>
                                            <td>{discount.isActive == true ? 'فعال' : 'غیرفعال'}</td>
                                            <td>
                                                <div className='btn-group-inline'>
                                                    <Link href={`/admin/discounts/${discount._id}`} className='btn-custom-edit rounded'>
                                                        <AiOutlineEdit/>
                                                    </Link>
                                                    <button onClick={() => handleDelete(discount._id)} className='btn-custom-delete rounded'>
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
    ) 
};

export default Discounts;