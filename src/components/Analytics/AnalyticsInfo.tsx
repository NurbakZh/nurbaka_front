import { Alert, Card, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    getAverageCheck,
    getClientCount,
    getClosedDeals,
    getMonthlyRevenue,
} from '../../api';
import { useThemeStore } from '../../shared/stores/theme';

interface AnalyticsInfoProps {
    clients: number;
    deals: number;
}

const AnalyticsInfo: React.FC<AnalyticsInfoProps> = ({ clients, deals } ) => {
    const theme = useThemeStore((x) => x.theme);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const [revenue, clients, deals, averageCheck] = await Promise.all([
                    getMonthlyRevenue(),
                    getClientCount(),
                    getClosedDeals(),
                    getAverageCheck(),
                ]);

                setData([revenue, clients, deals, averageCheck]);
            } catch (err) {
                setError('Failed to fetch analytics data');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (loading) return <Spin size="large" />;
    if (error) return <Alert message={error} type="error" />;

    const styles = {
        backgroundColor: theme === 'light' ? 'var(--card-light)' : 'var(--card-dark)', 
        color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
        borderRadius: '12px',
        padding: '0px',
        border: 'none',
        fontSize: '16px',
        boxShadow: theme === 'light' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : '0px 4px 10px rgba(255, 255, 255, 0.1)',
        marginBottom: '10px',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Card className={`card ${theme}`} style={styles} title={<Typography style={{ 
                color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
                fontSize: '18px',
                fontWeight: 'bold',
            }}>
                💰 Ежемесячный доход
            </Typography>}>
                <div style={{ padding: '0 12px' }}> 
                    <p>Всего Руб: {data[0]?.revenue.RUB || 0} RUB</p>
                    <p>Всего Тон: {data[0]?.revenue.TON || 0} TON</p>
                    <p>Всего Доллары: {data[0]?.revenue.USD || 0} USD</p>
                </div>
            </Card>
            <Card 
                className={`card ${theme}`} 
                style={styles} title={<Typography style={{ color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)', fontSize: '18px', fontWeight: 'bold' }}>👥 Количество клиентов</Typography>} >
                <div style={{ padding: '0 12px' }}> 
                    <p>Клиенты: {clients}</p>
                </div>
            </Card>
            <Card className={`card ${theme}`} style={styles} title={<Typography style={{ color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)', fontSize: '18px', fontWeight: 'bold' }}>📊 Количество сделок</Typography>} >
                <div style={{ padding: '0 12px' }}> 
                    <p>Сделки: {deals}</p>
                </div>
            </Card>
            <Card className={`card ${theme}`} style={styles} title={<Typography style={{ color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)', fontSize: '18px', fontWeight: 'bold'   }}>💵 Средний чек</Typography>} >
                <div style={{ padding: '0 12px' }}> 
                    <p>Средняя сумма: {data[3]?.averageCheck.averageCheckInRUB || 0} RUB</p>
                </div>
            </Card>
        </div>
    );
};



export default AnalyticsInfo; 