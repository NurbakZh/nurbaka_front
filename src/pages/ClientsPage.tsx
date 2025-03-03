import React from 'react';
import ClientsListPage from '../components/Clients/ClientsListPage';
import NavBar from '../shared/components/NavBar/NavBar';

const ClientsPage: React.FC = () => {
    return (
        <div className='page'>
            <ClientsListPage />
            <NavBar />
        </div>
    );
};

export default ClientsPage;