import React from 'react';
import UpdateForm from './UpdateForm';
import AuthWrapper from '@/app/components/auth/Auth';

const UpdateDiscount = async ({params}) => {
    const {id} = await params;
   
    const fetchDiscount = async () => {
        try{
            const discountResponse = await fetch(`http://localhost:3000/api/discount-codes/${id}`);
            const data = await discountResponse.json();
            return data;
        }catch(error){
            console.log("مشگلی در دریافت کد تخفیف پیش آمده است");
        }
    }  

    const discount = await fetchDiscount(); 
    return (
        <AuthWrapper>
            <UpdateForm discount={discount}/>
        </AuthWrapper>
    );
};

export default UpdateDiscount;