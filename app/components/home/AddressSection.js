"use client";
import React, { useContext, useEffect, useRef, useState } from 'react';
import "@/app/styles/address.css";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Alert } from 'react-bootstrap';
import { getProvinces } from '@/app/home/lib/getProvinces';
import { getCities } from '@/app/home/lib/getCities';
import { getAddresses } from '@/app/home/lib/getAddresses';
import { getAddress } from '@/app/home/lib/getAddress';
import { useCart } from '@/app/context/CartContext';

const AddressSection = () => {
    const {cart, addAddressToCart} = useCart();

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // for modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // for address
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [address, setAddress] = useState({
        _id: "",
        province: "",
        city: "",
        address: "",
        postalCode: "",
        number: "",
        unit: "",
        isRecepient: false,
        recepientFirstName: "",
        recepientLastName: "",
        recepientMobile: ""
    });
    const [formError, setFormError] = useState("");
    const isRecepient = useRef();

    const [type, setType] = useState('add');

    useEffect(() => {
        const fetchAddresses = async function () {
            try {
                const data = await getAddresses();
                if (!Array.isArray(data)) {
                    setError('داده های دریافتی معتبر نمی باشد');
                }
                setAddresses(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(true);
            }
        } 
        fetchAddresses();
    }, []);

    const handleShowAndProvinces = async function (params) {
        setType('add');
        setAddress({_id: "", province: "", city: "", address: "", postalCode: "", number: "", unit: "",
            isRecepient: false, recepientFirstName: "", recepientLastName: "", recepientMobile: ""
        });
        handleShow();
        try {
            const data = await getProvinces();
            
            if (!Array.isArray(data)) {
                throw new Error("داده های دریافتی معتبر نمی باشند");  
            }
            setProvinces(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(true);
        }
    }

    const handleSelectProvince = async (province) => {
        setAddress({...address, province });
        try {
            const data = await getCities(province);
            
            if (!Array.isArray(data)) {
                throw new Error("داده های دریافتی معتبر نمی باشند");  
            }
            setCities(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(true);
        }
    }

    const validateAddressForm = () => {
        const postalCodePattern = /\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b/;
        const mobilePattern = /^(\+98|98|0)9\d{9}$/;
        if (!address.province || address.province.trim().length !== 24 || typeof address.province !== "string") {
            setFormError("انتخاب استان الزامیست");
            return false;
        }
        if (!address.city || address.city.trim().length !== 24 || typeof address.city !== "string") {
            setFormError("انتخاب شهر الزامیست");
            return false;
        }
        if (!address.address || address.address.trim() === "" || typeof address.address !== "string") {
            setFormError("نشانی الزامیست");
            return false;
        }
        if (!address.postalCode || address.postalCode.trim().length !== 10 || typeof address.postalCode !== "string") {
            setFormError("کد پستی الزامیست");
            return false;
        }
        if (!postalCodePattern.test(address.postalCode)) {
            setFormError("کد پستی نامعتبر است");
            return false;
        }
        if (!address.number || isNaN(address.number)) {
            setFormError("پلاک الزامیست");
            return false;
        }
        if (!address.unit || isNaN(address.unit)) {
            setFormError("واحد الزامیست");
            return false;
        }

        if (typeof address.isRecepient != 'boolean' ) {
            setFormError("خطای اعتبارسنجی");
            return false;
        }
        if (!address.isRecepient) {
            
            if (!address.recepientFirstName || address.recepientFirstName.trim() === "" || typeof address.recepientFirstName !== "string") {
                setFormError("درصورتیکه گیرنده خودتان نیستید، نام گیرنده الزامیست");
                return false;
            }
            if (!address.recepientLastName || address.recepientLastName.trim() === "" || typeof address.recepientLastName !== "string") {
                setFormError("درصورتیکه گیرنده خودتان نیستید، نام خانوادگی گیرنده الزامیست");
                return false;
            }
            if (!address.recepientMobile || address.recepientMobile.trim() === "" || typeof address.recepientMobile !== "string") {
                setFormError("درصورتیک گیرنده خودتان نیستید، موبایل گیرنده الزامیست");
                return false;
            }
            if (!mobilePattern.test(address.recepientMobile)) {
                setFormError("موبایل گیرنده نامعتبر است");
                return false;
            }
            
            setFormError("");
            return true;
            
        }
        
        setFormError("");
        return true;
        
    }

    async function handleAddressSubmit(params) {
        setType('add');
        handleClose();
        setLoading(true);
        if (!validateAddressForm()) {
            return;
        }
        setFormError("");
        setError("");
        try {
            const res = await fetch('/api/addresses/home', {
                method: 'POST',
                headers: {
                    'Content_Type' : 'application/json'
                },
                body: JSON.stringify(address)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                throw new Error(data.message || 'مشگلی در ثبت آدرس پیش آمده است');
            }
            alert('آدرس با موفقیت ثبت شد');
            const updatedAddresses = await getAddresses();
            setAddresses(updatedAddresses);
            setAddress({_id: "", province: "", city: "", address: "", postalCode: "", number: "", unit: "",
                isRecepient: false, recepientFirstName: "", recepientLastName: "", recepientMobile: ""
            });

        } catch (error) {
           alert(error.message || 'مشگلی در ثبت آدرس رخ داده است'); 
        } finally {
            setLoading(false);
        }
    }

    const handleShowAndEdit = async(id) => {
        try {
            await handleShowAndProvinces();
            setType('edit');
            const data = await getAddress(id);
            if (!data instanceof Object) {
                throw new Error("داده ی دریافتی معتبر نمی باشد");  
             }
             setAddress(data);
             console.log(data.province);
             if(data.isRecepient){
                isRecepient.current.checked = true; 
             }
             
            const cities = await getCities(data.province);
            setCities(cities);
        } catch (error) {
            setError(error);
        } 
    }

    async function handleAddressEdit(id) {
        handleClose();
        setLoading(true);
        console.log(address);
        
        if (!validateAddressForm()) {
            return;
        }
        setFormError("");
        setError("");
        try {
            const res = await fetch(`/api/addresses/home/${id}`, {
                method: 'PUT',
                headers: {
                    'Content_Type' : 'application/json'
                },
                body: JSON.stringify(address)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                throw new Error(data.message || 'مشگلی در ویرایش آدرس پیش آمده است');
            }
            alert('آدرس با موفقیت ویرایش شد');
            
            const updatedAddresses = await getAddresses();
            setAddresses(updatedAddresses);
            setAddress({_id: "", province: "", city: "", address: "", postalCode: "", number: "", unit: "",
                isRecepient: false, recepientFirstName: "", recepientLastName: "", recepientMobile: ""
            });

        } catch (error) {
           alert(error.message || 'مشگلی در ویرایش آدرس رخ داده است'); 
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        setLoading(true);
        setFormError("");
        setError("");
        try {
            const res = await fetch(`/api/addresses/home/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content_Type' : 'application/json'
                },
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                throw new Error(data.message || 'مشگلی در حذف آدرس پیش آمده است');
            }
            alert('آدرس با موفقیت حذف شد');
            
            const updatedAddresses = await getAddresses();
            setAddresses(updatedAddresses);
            setAddress({_id: "", province: "", city: "", address: "", postalCode: "", number: "", unit: "",
                isRecepient: false, recepientFirstName: "", recepientLastName: "", recepientMobile: ""
            });

        } catch (error) {
           alert(error.message || 'مشگلی در حذف آدرس رخ داده است'); 
        } finally {
            setLoading(false);
        }
    }

    const handleSelectAddress = async (e) => {
        if (e.target.checked) {
            addAddressToCart(e.target.value);
        }
    }
    return (
        <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
            {/* <!-- start vontent header */}
            <section className="content-header mb-3">
                <section className="d-flex justify-content-between align-items-center">
                    <h2 className="content-header-title content-header-title-small">
                        انتخاب آدرس و مشخصات گیرنده
                    </h2>
                    <section className="content-header-link">
                        {/* <a href="#">مشاهده همه</a */}
                    </section>
                </section>
            </section>

            <section className="address-alert alert alert-primary d-flex align-items-center p-2" role="alert">
                <i className="fa fa-info-circle flex-shrink-0 me-2"></i>
                <section>
                    پس از ایجاد آدرس، آدرس را انتخاب کنید.
                </section>
            </section>

            <section className="address-select">
                {addresses.map((address, index) => {
                    return (
                        <div key={address._id}>
                            <input type="radio" onChange={e => handleSelectAddress(e)} name="address" value={address._id} id={`a${index}`}/>
                            <label htmlFor={`a${index}`} className="address-wrapper mb-2 p-2">
                                <section className="mb-2">
                                    <i className="fa fa-map-marker-alt mx-1"></i>
                                    آدرس : {address.address}
                                </section>
                                {!address.isRecepient && (
                                    <>
                                        <section className="mb-2">
                                            <i className="fa fa-user-tag mx-1"></i>
                                            گیرنده : {`${address.recepientFirstName} ${address.recepientLastName}`}
                                        </section>
                                        <section className="mb-2">
                                            <i className="fa fa-mobile-alt mx-1"></i>
                                            موبایل گیرنده : {address.recepientMobile}
                                        </section>
                                    </>
                                )}
                                <span>
                                    <a className="" onClick={() => handleDelete(address._id)}><i className="fa fa-times"></i> حذف آدرس</a>
                                    <a className="" style={{marginLeft: "100px"}} onClick={() => handleShowAndEdit(address._id)}><i className="fa fa-edit"></i> ویرایش آدرس</a>
                                </span>
                                <span className="address-selected">کالاها به این آدرس ارسال می شوند</span>
                            </label>
                        </div>
                    )
                })}

                <section className="address-add-wrapper">
                    
                    <button className="address-add-button" type="button" onClick={handleShowAndProvinces} >
                        <i className="fa fa-plus"></i> ایجاد آدرس جدید
                    </button>
                    {/* <!-- start add address Modal */}
                    {formError && <Alert variant='warning'>{formError}</Alert>}
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <i className={type === 'add' ? "fa fa-plus" : "fa fa-edit"}></i> {type === 'add' ?  "ایجاد آدرس جدید" : "ویرایش آدرس"}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form className="row">
                                <Form.Group className="col-6 mb-2">
                                    <Form.Label htmlFor="province" className="form-label mb-1">استان</Form.Label>
                                    <Form.Select className="form-select form-select-sm" id="province" value={address.province} onChange={e => handleSelectProvince(e.target.value)}>
                                        <option >استان را انتخاب کنید</option>
                                        {provinces.map(province => {
                                            return (
                                                <option key={province._id} value={province._id}>{province.name}</option>
                                            );
                                        })}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="col-6 mb-2">
                                    <Form.Label htmlFor="province" className="form-label mb-1">شهر</Form.Label>
                                    <Form.Select className="form-select form-select-sm" id="province" value={address.city} onChange={e  => setAddress({...address, city: e.target.value})}>
                                        <option >شهر را انتخاب کنید</option>
                                        {cities.map(city => {
                                            return (
                                                <option key={city._id} value={city._id}>{city.name}</option>
                                            );
                                        })}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="col-12 mb-2">
                                    <Form.Label htmlFor="address" className="form-label mb-1">نشانی</Form.Label>
                                    <Form.Control value={address.address} onChange={e  => setAddress({...address, address: e.target.value})} type="text" className="form-control form-control-sm" id="address" placeholder="نشانی"/>
                                </Form.Group>
                                <Form.Group className="col-6 mb-2">
                                    <Form.Label htmlFor="postal_code" className="form-label mb-1">کد پستی</Form.Label>
                                    <Form.Control value={address.postalCode} onChange={e  => setAddress({...address, postalCode: e.target.value})} type="text" className="form-control form-control-sm" id="postal_code" placeholder="کد پستی"/>
                                </Form.Group>
                                <Form.Group className="col-3 mb-2">
                                    <Form.Label htmlFor="no" className="form-label mb-1">پلاک</Form.Label>
                                    <Form.Control value={address.number} onChange={e  => setAddress({...address, number: e.target.value})} type="text" className="form-control form-control-sm" id="no" placeholder="پلاک"/>
                                </Form.Group>
                                <Form.Group className="col-3 mb-2">
                                    <Form.Label htmlFor="unit" className="form-label mb-1">واحد</Form.Label>
                                    <Form.Control value={address.unit} onChange={e  => setAddress({...address, unit: e.target.value})} type="text" className="form-control form-control-sm" id="unit" placeholder="واحد"/>
                                </Form.Group>
                                        
                                <section className="border-bottom mt-2 mb-3"></section>

                                <section className="col-12 mb-2">
                                    <Form.Check value={address.isRecepient} ref={isRecepient} onChange={e  => setAddress({...address, isRecepient: !address.isRecepient})} type="checkbox" label="گیرنده سفارش خودم هستم" id="receiver"/>
                                </section>

                                <Form.Group className="col-6 mb-2">
                                    <Form.Label htmlFor="first_name" className="form-label mb-1">نام گیرنده</Form.Label>
                                    <Form.Control value={address.recepientFirstName} onChange={e  => setAddress({...address, recepientFirstName: e.target.value})} type="text" className="form-control form-control-sm" id="first_name" placeholder="نام گیرنده"/>
                                </Form.Group>

                                <Form.Group className="col-6 mb-2">
                                    <Form.Label htmlFor="last_name" className="form-label mb-1">نام خانوادگی گیرنده</Form.Label>
                                    <Form.Control value={address.recepientLastName} onChange={e  => setAddress({...address, recepientLastName: e.target.value})} type="text" className="form-control form-control-sm" id="last_name" placeholder="نام خانوادگی گیرنده"/>
                                </Form.Group>

                                <Form.Group className="col-6 mb-2">
                                    <Form.Label htmlFor="mobile" className="form-label mb-1">شماره موبایل</Form.Label>
                                    <Form.Control value={address.recepientMobile} onChange={e  => setAddress({...address, recepientMobile: e.target.value})} type="text" className="form-control form-control-sm" id="mobile" placeholder="شماره موبایل"/>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className="py-1">
                            <Button variant="primary" onClick={() => type==='add' ? handleAddressSubmit() : handleAddressEdit(address._id)} className="btn btn-sm">{type==='add' ? "ثبت آدرس" : "ویرایش آدرس"}</Button>
                            <Button variant="danger" onClick={handleClose} className="btn btn-sm btn-danger" >بستن</Button>
                        </Modal.Footer>
                        
                    </Modal>
                    {/* <!-- end add address Modal --> */}
                </section>

            </section>
        </section>
    );
};

export default AddressSection;