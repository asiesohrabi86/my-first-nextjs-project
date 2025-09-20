"use client";
import { Alert, Button } from 'react-bootstrap';
import React, { useEffect } from 'react';

const GeneralError = ({error, onRetry = null}) => {
    useEffect(() => {
        console.log(error);
    }, [error]);
    return (
        <div className='d-flex flex-column align-items-center my-4'>
            <Alert variant='danger'>
                {error?.message || "خطایی رخ داده است، لطفا مجددا تلاش کنید"}
            </Alert>
            {onRetry && (<Button className='mt-3' variant="primary" onClick={onRetry}>تلاش مجدد</Button>)}
        </div>
    );
};

export default GeneralError;