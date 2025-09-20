"use client";
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import AuthWrapper from '@/app/components/auth/Auth';

const UpdateForm = ({discount}) => {
    const [code, setCode] = useState(discount.code);
    const [discountPercentage, setDiscountPercentage] = useState(discount.discountPercentage);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expirationDate, setExpirationDate] = useState(new Date(discount.expirationDate));
    const [isActive, setIsActive] = useState(discount.isActive);
    const [formError, setFormError] = useState("");
    const router = useRouter();

    const isActiveInput = useRef();
    console.log(isActiveInput);
    useEffect(()=>{
        if(isActive == true){
            isActiveInput.current.checked = true; 
        }
    });
    
    const validateForm = () => {
        if (!code || typeof code !== "string" || code.trim() === "") {
            setFormError("فیلد کد تخفیف الزامی می باشد");
            return false;
        }else if(code.length < 3 || code.length > 30){
            setFormError('کد تخفیف باید بین 3 تا 30 کاراکتر باشد');
            return false;
        }

        if (!discountPercentage || isNaN(discountPercentage)) {
            setFormError("درصد تخفیف الزامیست");
            return false;
        }else if (discountPercentage < 1 || discountPercentage > 100) {
            setFormError("درصد تخفیف بین  1 تا 100 میباشد");
            return false;
        }
        
        if (!expirationDate || !expirationDate instanceof Date) {
            setFormError("تاریخ انقضای تخفیف الزامیست");
            return false;
        }else if(expirationDate < new Date()){
            setFormError("تاریخ انقضای تخفیف نامعتبر است");
            return false;
        }

        if (typeof isActive != 'boolean' ) {
            setFormError("وضعیت تخفیف الزامیست");
            return false;
        }

        setFormError("");
        return true;
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
           return; 
        }

        try {
            const response = await fetch(`/api/discount-codes/${discount._id}`, {
                method: "PUT",
                headers: {
                    'Content_Type': 'application/json'
                },
                body: JSON.stringify({
                    code,
                    discountPercentage,
                    expirationDate,
                    isActive
                })
            });
            
            if (response.status === 400) {
                let message = await response.json();
                setFormError(message.message);
            }

            if (!response.ok) {
                throw new Error("مشگلی در ویرایش کد تخفیف پیش آمده است");
                
            }
            router.push('/admin/discounts?msg=کد تخفیف با موفقیت ویرایش شد');
        } catch (error) {
           setError(error.message); 
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
                            <h2 className='my-4'>ویرایش کد تخفیف </h2>
                            {/* logical error */}
                            {error && <Alert variant='danger'>{error}</Alert>}
                            {/* validation error */}
                            {formError && <Alert variant='warning'>{formError}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className='mb-3'>
                                    <Form.Label>کد تخفیف</Form.Label>
                                    <Form.Control value={code} onChange={(e)=>setCode(e.target.value)} type='text' placeholder='کد تخفیف...' required/>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>درصد تخفیف</Form.Label>
                                    <Form.Control value={discountPercentage}  onChange={(e)=>setDiscountPercentage(e.target.value)} type='number' min="1" max="100" placeholder='درصد تخفیف...' required/>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label className='d-block'>تاریخ انقضا</Form.Label>
                                    <DatePicker value={expirationDate} calendar={persian} locale={persian_fa} format="HH:mm:ss  YYYY/MM/DD" onChange={setExpirationDate} required/>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Check className='d-inline me-2' ref={isActiveInput} onChange={(e)=>setIsActive(!isActive)} type='checkbox'/>
                                    <Form.Label>فعال</Form.Label>
                                </Form.Group>
                                <Button type='submit'>ذخیره</Button>
                            </Form>
                        </main>
                    </Col>
                </Row>
            </Container>
        </AuthWrapper>
    );
};

export default UpdateForm;