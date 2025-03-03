import React from 'react';
import DealsListPage from '../components/Deals/DealsListPage';
import NavBar from '../shared/components/NavBar/NavBar';

const DealsPage: React.FC = () => {
    return (
        <div className='page'>
            <DealsListPage />
            <NavBar />
        </div>
    );
};

export default DealsPage;   