import React from 'react';
import { Navbar, NavbarBrand } from 'react-bootstrap';

const Header = () => {
    return (
        <Navbar bg='light' expand="lg" className='d-flex justify-content-between ps-2'>
            <NavbarBrand>پنل ادمین</NavbarBrand>
        </Navbar>
    );
};

export default Header;