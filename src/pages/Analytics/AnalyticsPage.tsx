import React from 'react';
import NavBar from '../../shared/components/NavBar/NavBar';
import AnalyticsListPage from './AnalyticsListPage';

const AnalyticsPage: React.FC = () => {
    return (
        <div className='page'>
            <AnalyticsListPage />
            <NavBar />
        </div>
    );
};

export default AnalyticsPage;