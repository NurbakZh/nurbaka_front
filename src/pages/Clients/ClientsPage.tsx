import React from 'react';
import NavBar from '../../shared/components/NavBar/NavBar';
import ClientsListPage from './ClientsListPage';

const ClientsPage: React.FC = () => {
    return (
        <div className='page'>
            <ClientsListPage />
            <NavBar />
        </div>
    );
};

export default ClientsPage;