"use client";
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { getProductGallery } from "@/app/home/lib/getProductGallery";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import ProductComments from '@/app/components/home/ProductComments';
import { Alert } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';

const AddProductComments = ({id}) => {
    const [comment, setComment] = useState("");
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState("");
    const [msg, setMsg] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {data: session, status} = useSession();
    const myForm = useRef();
    const searchParams = useSearchParams();
    

    const validateForm = () => {
        if (!comment || typeof comment !== 'string' || comment.trim() === "") {
            setFormError("نظر الزامی می باشد");
            return false;
        }else if(comment.length < 3 || comment.length > 300){
            setFormError('نظر باید بین 3 تا 300 کاراکتر باشد');
            return false;
        }
        
        setFormError("");
        return true;
        
    }

    const handleSubmit = async () => {
        // e.preventDefault();
        if (!validateForm()) {
           return; 
        }
        setShow(false);

        try {
            const response = await fetch(`/api/comments`, {
                method: "POST",
                headers: {
                    'Content_Type': 'application/json'
                },
                body: JSON.stringify({productId: id, comment: comment})
            });

            setComment("");
            
            if (response.status === 400) {
                let message = await response.json();
                setFormError(message.message);
            }

            if (!response.ok) {
                throw new Error("مشگلی در ثبت نظر پیش آمده است");
                
            }

            if(response.status === 201){
                setMsg('دیدگاه شما با موفقیت ثبت شد');
                setTimeout(() => {
                    setMsg("");
                }, 3000);
            }
            
        } catch (error) {
           setError(error.message); 
        }
    }

    return (
        <>
            {/* logical error */}
            {error && <Alert variant='danger'>{error}</Alert>}
            {/* validation error */}
            {formError && <Alert variant='warning'>{formError}</Alert>}
            {msg && <Alert variant='success'>{msg}</Alert>}
            <section id="comments" className="content-header mt-2 mb-4">
                <section className="d-flex justify-content-between align-items-center">
                    <h2 className="content-header-title content-header-title-small">
                        دیدگاه ها
                    </h2>
                    <section className="content-header-link">
                        {/* <a href="#">مشاهده همه</a>--> */}
                    </section>
                </section>
            </section>
            <section className="product-comments mb-4">

                <section className="comment-add-wrapper">
                    {status === 'authenticated' && <Button className="comment-add-button" type="button" variant="primary" onClick={handleShow}>
                            <i className="fa fa-plus"></i> افزودن دیدگاه
                        </Button>}
                    {status === 'unauthenticated' && <Link href="../../../auth/login" className="comment-add-button" variant="primary">
                        <i className="fa fa-plus"></i> برای افزودن دیدگاه ابتدا باید وارد سایت شوید
                    </Link>}
                        
                    
                    <Modal className="modal fade" show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <i className="fa fa-plus"></i> افزودن دیدگاه
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form className="row">
                            <Form.Group className="col-12 mb-2">
                                <Form.Label htmlFor="comment" className="form-label mb-1">دیدگاه شما</Form.Label>
                                <Form.Control value={comment} onChange={e => setComment(e.target.value)} as="textarea" rows={4} className="form-control-sm" id="comment" placeholder="دیدگاه شما ..." />
                            </Form.Group>

                            </Form>   
                        </Modal.Body>
                        <Modal.Footer>
                        <Button type="submit" variant="primary" onClick={handleSubmit}>
                            ثبت دیدگاه
                        </Button>
                        
                        <Button variant="danger" onClick={handleClose}>
                            بستن
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </section>

                <ProductComments productId={id}/>
            </section>
        </>
    );
};

export default AddProductComments;