import React from 'react';
import Image from 'next/image';

const AdsCard = ({adsBrand, index}) => {
    return (
        <section className="col-12 col-md-6 mt-2 mt-md-0">
            <a href={adsBrand.url}>
                <Image className="d-block rounded-2 w-100" src={adsBrand.imageUrl} alt={`ads ${index+1}`} width={800} height={200} priority/>
            </a>
        </section>
    );
};

export default AdsCard;