"use client";
import AuthWrapper from '@/app/components/auth/Auth';
import GeneralError from '@/app/components/ui/GeneralError';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Alert, Table, Badge } from 'react-bootstrap';
import {AiOutlineDelete, AiOutlineEdit, AiOutlinePlus} from "react-icons/ai";

const UsersList = ({users}) => {
    const [myUsers, setMyUsers] = useState(users);
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

    const handleIsAdmin = async(id) => {
        try {
            const response = await fetch(`/api/users/isAdmin/${id}`, {
                method: "PUT",
                headers: {
                    "Accept" : "application/json"
                }
            });

            if(!response.ok){
                throw new Error("خطا در تغییر وضعیت ادمین");
            }

            const {message} = await response.json();
            setMsg(message);

            setMyUsers(myUsers.map(user => {
                if (user._id === id) {
                    return {...user, isAdmin: !user.isAdmin};
                }
                return user;
            }));

            setTimeout(() => {
                setMsg("");
            }, 3000);

        } catch (error) {
            setError(" خطایی در تغییر وضعیت ادمین پیش آمده است");
        }
    }

    const handleDelete = async(id) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept" : "application/json"
                }
            });
    
            const {message} = await response.json();
            setMsg(message);

            setMyUsers(myUsers.filter(user => user._id !== id));

            setTimeout(() => {
                setMsg("");
            }, 3000);

        } catch (error) {
            setError("مشگلی در حذف کاربر پیش آمد");
        }
    }
    
    return (
        <AuthWrapper>
            <main className='p-4'>
            {msg && <Alert variant='success'>{msg}</Alert>}
            <h4>مدیریت کاربران</h4>
            {error && <GeneralError error={error}/>}
            {loading ? <LoadingSpinner/> : (
                <>
                    <Link href="users/add" className='btn-custom-add mb-3 px-2 py-1 rounded'>
                        <AiOutlinePlus/>
                        افزودن کاربر جدید
                    </Link>
                    <Table striped hover bordered>
                        <thead>
                            <tr>
                                <th>شناسه</th>
                                <th>نام کاربر</th>
                                <th>موبایل</th>
                                <th>ایمیل</th>
                                <th>وضعیت</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myUsers.map((user, index) => 
                                <tr key={index}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.mobile}</td>
                                    <td>{user.email || '-'}</td>
                                    <td>
                                        {user.isAdmin == true ? <Badge bg="info">ادمین</Badge> : <Badge bg="secondary">کاربر عادی</Badge>}
                                    </td>
                                    <td>
                                        <div className='btn-group-inline'>
                                            <button onClick={() => handleIsAdmin(user._id)} className='btn-custom-isAdmin rounded'>
                                            {user.isAdmin == true ? 'تبدیل به کاربر عادی' : 'تبدیل به ادمین'}
                                            </button>
                                            <Link href={`/admin/users/${user._id}`} className='btn-custom-save rounded'>
                                                <AiOutlineEdit/>
                                                ویرایش
                                            </Link>
                                            <button onClick={() => handleDelete(user._id)} className='btn-custom-delete rounded'>
                                                <AiOutlineDelete/>
                                                حذف
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

export default UsersList;