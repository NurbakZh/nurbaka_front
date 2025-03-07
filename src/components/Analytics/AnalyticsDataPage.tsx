import React from 'react';
import { useThemeStore } from '../../shared/stores/theme';
import AnalyticsInfo from './AnalyticsInfo';

const AnalyticsDataPage: React.FC = () => {
    const theme = useThemeStore((x) => x.theme);

    return (
        <div className={`page ${theme}`} style={{ padding: '20px' }}>
            <AnalyticsInfo />
        </div>
    );
};

export default AnalyticsDataPage;