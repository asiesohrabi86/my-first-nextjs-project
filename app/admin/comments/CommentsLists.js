"use client";
import AuthWrapper from '@/app/components/auth/Auth';
import GeneralError from '@/app/components/ui/GeneralError';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Alert, Table, Badge } from 'react-bootstrap';
import {AiOutlineCheck, AiOutlineClose, AiOutlineDelete} from "react-icons/ai";

const CommentsLists = ({comments}) => {
    const [myComments, setMyComments] = useState(comments);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const searchParams = useSearchParams();

    useEffect(() => {
        setMsg(searchParams.get('msg'));
        setTimeout(() => {
            setMsg("");  
        }, 3000);
    }, [searchParams]);

    const handleEdit = async(id) => {
        try {
            const response = await fetch(`/api/comments/${id}`, {
                method: "PUT",
                headers: {
                    "Accept" : "application/json"
                }
            });

            if(!response.ok){
                throw new Error("خطا در تغییر وضعیت تایید");
            }
    
            const {message} = await response.json();
            setMsg(message);

            setMyComments(myComments.map(comment => {
                if (comment._id === id) {
                    return {...comment, isConfirmed: !comment.isConfirmed};
                }
                return comment;
            }));

            setTimeout(() => {
                setMsg("");
            }, 3000);

        } catch (error) {
            setError(" خطایی در تغییر وضعیت تایید پیش آمده است");
        }
    }

    const handleDelete = async(id) => {
        try {
            const response = await fetch(`/api/comments/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept" : "application/json"
                }
            });
    
            const {message} = await response.json();
            setMsg(message);

            setMyComments(myComments.filter(comment => comment._id !== id));

            setTimeout(() => {
                setMsg("");
            }, 3000);

        } catch (error) {
            setError("مشگلی در حذف پیش آمد");
        }
    }
    
    return (
        <AuthWrapper>
            <main className='p-4'>
            {msg && <Alert variant='success'>{msg}</Alert>}
            <h4>مدیریت نظرات</h4>
            {error && <GeneralError error={error}/>}
            {loading ? <LoadingSpinner/> : (
                <>
                    <Table striped hover bordered>
                        <thead>
                            <tr>
                                <th>شناسه</th>
                                <th>نام کاربر</th>
                                <th>موبایل کاربر</th>
                                <th>نظر</th>
                                <th>محصول</th>
                                <th>وضعیت تایید</th>
                                <th>تاریخ ثبت</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myComments.map((comment, index) => 
                                <tr key={index}>
                                    <td>{comment._id}</td>
                                    <td>{comment.userId.name}</td>
                                    <td>{comment.userId.phone}</td>
                                    <td>{comment.comment}</td>
                                    <td>{comment.productId.name}</td>
                                    <td>{comment.isConfirmed == true ? <Badge bg="success">تایید شده</Badge> : <Badge bg="warning">تایید نشده</Badge>}</td>
                                    <td>
                                        {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
                                    </td>
                                    <td>
                                        <div className='btn-group-inline'>
                                            <button onClick={() => handleEdit(comment._id)} className='btn-custom-edit rounded'>
                                                {comment.isConfirmed == false ? <AiOutlineCheck/> : <AiOutlineClose/>}
                                            </button>
                                            <button onClick={() => handleDelete(comment._id)} className='btn-custom-delete rounded'>
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
        </AuthWrapper>        
    );
};

export default CommentsLists;