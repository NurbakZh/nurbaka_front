import React from 'react';
import NavBar from '../../shared/components/NavBar/NavBar';
import DealsListPage from './DealsListPage';

const DealsPage: React.FC = () => {
    return (
        <div className='page'>
            <DealsListPage />
            <NavBar />
        </div>
    );
};

export default DealsPage;   