import React from 'react';
import Image from 'next/image';

const BrandCard = ({brand}) => {
    return (
        <section className="item">
            <section className="brand-item">
                <a href="#">
                    <Image className="rounded-2" src={brand.imageUrl} alt={brand.name} width={150} height={100} priority/>
                </a>
            </section>
        </section>
    );
};

export default BrandCard;