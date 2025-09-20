import React from 'react';
import { Spinner } from 'react-bootstrap';


const LoadingSpinner = () => {
    return (
        <div>
           <div className='d-flex justify-content-center my-4'>
                <Spinner animation='border'>
                    <span className='visually-hidden'>در حال بارگزاری...</span>
                </Spinner>
            </div> 
        </div>
    );
};

export default LoadingSpinner;