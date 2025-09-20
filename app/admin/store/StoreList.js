"use client";
import AuthWrapper from '@/app/components/auth/Auth';
import GeneralError from '@/app/components/ui/GeneralError';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Alert, Table, Form } from 'react-bootstrap';

const StoreList = ({products}) => {
    const count = products.length;
    const [myProducts, setMyProducts] = useState(products);
    const stocks = [];
    for (let i = 0; i < count; i++) {
        stocks[i] = myProducts[i].stock;
    }
    const [myStocks, setMyStocks] = useState(stocks);
    
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const searchParams = useSearchParams();

    useEffect(() => {
        setMsg(searchParams.get('msg'));
        setTimeout(() => {
            setMsg("");  
        }, 3000);
    }, [searchParams]);

    const handleChange = (e) => {

        setMyStocks(myStocks.map((myStock, index) => {
            if (index == e.target.dataset.id) {
                return (e.target.value);
            }
            return myStock;
        }));
    }

    const handleEdit = async(id, index) => {
        //start front validation
        if(!myStocks[index] || isNaN(myStocks[index])){
            setFormError("موجودی محصول الزامیست");
            return;
        }else if(myStocks[index] < 0){
            setFormError("موجودی محصول نباید کمتر از صفر باشد");
            return;
        }
        //end front validation
        try {
            const response = await fetch(`/api/store/${id}`, {
                method: "PUT",
                headers: {
                    "Accept" : "application/json"
                },
                body: JSON.stringify({stock: myStocks[index]})
            });
    
            const {message} = await response.json();
            setMsg(message);

            setTimeout(() => {
                setMsg("");
            }, 3000);

        } catch (error) {
            setError("مشگلی در ویرایش پیش آمد");
        }
    }
    
    return (
        <AuthWrapper>
            <main className='p-4'>
            {msg && <Alert variant='success'>{msg}</Alert>}
            <h4>مدیریت انبار</h4>
            {error && <GeneralError error={error}/>}
            {formError && <Alert variant='warning'>{formError}</Alert>}
            {loading ? <LoadingSpinner/> : (
                <>
                    <Table striped hover bordered>
                        <thead>
                            <tr>
                                <th>شناسه</th>
                                <th>نام محصول</th>
                                <th>موجودی</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myProducts.map((product, index) => 
                                <tr key={index}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>
                                        <Form.Group>
                                            <Form.Control value={myStocks[index]} className='text-end' data-id={index} onChange={(e)=> handleChange(e)} type='number' min="0" placeholder='موجودی...'/>
                                        </Form.Group>
                                    </td>
                                    <td>
                                        <div className='btn-group-inline'>
                                            <button onClick={() => handleEdit(product._id, index)} className='btn-custom-save rounded'>
                                                ذخیره
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

export default StoreList;