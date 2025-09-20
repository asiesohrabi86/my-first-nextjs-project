"use client";
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { Button } from 'react-bootstrap';

const LogoutButton = () => {
    const {data:session, status} = useSession();
    if (status === 'unauthenticated') {
        return null;
    }

    const handleLogout = () => {
        signOut({callbackUrl: "/"});
    }

    return (
        <Button variant='danger' onClick={handleLogout}>
           خروج 
        </Button>
    );
};

export default LogoutButton;