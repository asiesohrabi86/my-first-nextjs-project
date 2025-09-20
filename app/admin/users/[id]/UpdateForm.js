"use client";
import AuthWrapper from '@/app/components/auth/Auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Form} from 'react-bootstrap';

const UpdateForm = ({user}) => {
    const [name, setName] = useState(user.name);
    const [mobile, setMobile] = useState(user.mobile);
    const [email, setEmail] = useState(user.email || "");
    const [isAdmin, setIsAdmin] = useState(user.isAdmin);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState("");
    const router = useRouter();

    const isAdminInput = useRef();
    console.log(isAdminInput);
    useEffect(()=>{
        if(isAdmin == true){
            isAdminInput.current.checked = true; 
        }
    });

    const validateForm = () => {
        if (!name || typeof name !== "string" || name.trim() === "") {
            setFormError("نام کابر الزامی می باشد");
            return false;
        }else if(name.length < 3 || name.length > 30){
            setFormError('نام کاربر باید بین 3 تا 30 کاراکتر باشد');
            return false;
        }

        const mobilePattern = /^(\+98|98|0)9\d{9}$/;

        if (!mobile) {
            setFormError("موبایل کاربر الزامیست");
            return false;
        }else if (!mobilePattern.test(mobile)) {
            setFormError("موبایل کاربر معتبر نمی باشد");
            return false;
        }

        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;
        
        if(email && !emailPattern.test(email)){
            setFormError("ایمیل کاربر نامعتبر است");
            return false;
        }

        if (typeof isAdmin != 'boolean' ) {
            setFormError("وضعیت ادمین نامعتبر است");
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
            const response = await fetch(`/api/users/${user._id}`, {
                method: "PUT",
                headers: {
                    'Content_Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    mobile,
                    email,
                    isAdmin
                })
            });
            
            if (response.status === 400) {
                let message = await response.json();
                setFormError(message.message);
            }

            if (!response.ok) {
                throw new Error("مشگلی در ویرایش کاربر پیش آمده است");
                
            }
            router.push('/admin/users?msg=کاربر با موفقیت ویرایش شد');
        } catch (error) {
           setError(error.message); 
        }
    }
    return (
        <AuthWrapper>
            <main className='p-4'>
                <h2 className='my-4'>ویرایش کاربر </h2>
                {/* logical error */}
                {error && <Alert variant='danger'>{error}</Alert>}
                {/* validation error */}
                {formError && <Alert variant='warning'>{formError}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label>نام کاربر</Form.Label>
                        <Form.Control value={name} onChange={(e)=>setName(e.target.value)} type='text' placeholder='نام کاربر...' required/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>شماره موبایل</Form.Label>
                        <Form.Control value={mobile}  onChange={(e)=>setMobile(e.target.value)} type='text' placeholder='شماره موبایل...' required/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='d-block'>ایمیل (اختیاری)</Form.Label>
                        <Form.Control value={email}  onChange={(e)=>setEmail(e.target.value)} type='text' placeholder='ایمیل...'/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Check className='d-inline me-2' ref={isAdminInput} onChange={(e)=>setIsAdmin(!isAdmin)} type='checkbox'/>
                        <Form.Label>ادمین</Form.Label>
                    </Form.Group>
                    <Button type='submit'>ذخیره</Button>
                </Form>
            </main>
        </AuthWrapper>
    );
};

export default UpdateForm;