import React from 'react';
import NavBar from '../shared/components/NavBar/NavBar';
const AnalyticsPage: React.FC = () => {
    return (
        <div className='page' style={{ height: 'calc(100vh - 62px)', marginBottom: '10px', overflow: 'scroll', paddingBottom: '0px' }}>
            <NavBar />
        </div>
    );
};

export default AnalyticsPage;