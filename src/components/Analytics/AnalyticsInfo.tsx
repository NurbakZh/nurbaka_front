import { Alert, Card, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    getAverageCheck,
    getClientCount,
    getClosedDeals,
    getMonthlyRevenue,
    getReturningClients,
    getTotalDebts
} from '../../api';
import { useThemeStore } from '../../shared/stores/theme';

const AnalyticsInfo: React.FC = () => {
    const theme = useThemeStore((x) => x.theme);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const [revenue, clients, deals, averageCheck, debts, returningClients] = await Promise.all([
                    getMonthlyRevenue(),
                    getClientCount(),
                    getClosedDeals(),
                    getAverageCheck(),
                    getTotalDebts(),
                    getReturningClients(),
                ]);

                setData([revenue, clients, deals, averageCheck, debts, returningClients]);
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
        backgroundColor: theme === 'light' ? 'var(--primary-light)' : 'var(--secondary-dark)',
        color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
        borderRadius: '10px',
        fontSize: '16px',
        marginBottom: '10px',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Card style={styles} title={<Typography style={{ 
                color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
                fontSize: '18px',
                fontWeight: 'bold',
            }}>
                💰 Ежемесячный доход
            </Typography>}>
                <p>Всего Руб: {data[0]?.revenue.totalRub || 0} RUB</p>
                <p>Всего Тон: {data[0]?.revenue.totalTon || 0} TON</p>
            </Card>
            <Card style={styles} title={<Typography style={{ color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)', fontSize: '18px', fontWeight: 'bold' }}>👥 Количество клиентов</Typography>} >
                <p>Клиенты: {data[1]?.clients || 0}</p>
            </Card>
            <Card style={styles} title={<Typography style={{ color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)', fontSize: '18px', fontWeight: 'bold'   }}>✅ Закрытые сделки</Typography>} >
                <p>Закрытые сделки: {data[2]?.closedDeals || 0}</p>
            </Card>
            <Card style={styles} title={<Typography style={{ color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)', fontSize: '18px', fontWeight: 'bold'   }}>💵 Средний чек</Typography>} >
                <p>Средняя сумма: {data[3]?.averageCheck.averageAmount || 0} RUB</p>
            </Card>
            <Card style={styles} title={<Typography style={{ color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)', fontSize: '18px', fontWeight: 'bold'   }}>💳 Общие долги</Typography>} >
                <p>Общие долги: {data[4]?.debts.totalDebts || 0} RUB</p>
            </Card>
            <Card style={styles} title={<Typography style={{ color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)', fontSize: '18px', fontWeight: 'bold'   }}>🔄 Возвращающиеся клиенты</Typography>} >
                <p>Средний процент: {data[5]?.returningClients.averagePercentage || 0}%</p>
            </Card>
        </div>
    );
};



export default AnalyticsInfo; 