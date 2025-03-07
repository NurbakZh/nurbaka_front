import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllClients, getAllDeals } from '../api';
import AnalyticsInfo from '../components/Analytics/AnalyticsInfo';
import NavBar from '../shared/components/NavBar/NavBar';
import { useThemeStore } from '../shared/stores/theme';

const MainPage: React.FC = () => {
    const { setTheme } = useThemeStore();
    const [totalClients, setTotalClients] = useState<number>(0);
    const [totalDeals, setTotalDeals] = useState<number>(0);
    useEffect(() => {
        fetchClients();
        fetchDeals();
    }, []);
    const fetchClients = useCallback(async () => {
        const data = await getAllClients(10, 1);
        setTotalClients(data.totalCount);
    }, []);
    const fetchDeals = useCallback(async () => {
        const data = await getAllDeals(10, 1);
        setTotalDeals(data.totalCount);
    }, []);
    const theme = useThemeStore((x) => x.theme);
    const [user, setUser] = useState<{
        telegramId?: string;
        username?: string;
        phoneNumber?: string;
        fullName?: string;
        role?: string;
    }>({});

    useEffect(() => {
        const someData = {
            telegramId: '5100432',
            username: '@nurba_zh',
            phoneNumber: '877473791938',
            fullName: 'Жомартов Нурбек',
            role: 'admin'
        }
        const postData = async () => {
            try {
                const response = await fetch('http://192.168.56.181:3000/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(someData),
                });
                const data = await response.json();
                setUser(data.user);
                localStorage.setItem('accessToken', data.acessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        postData();
    }, []);

    return (
        <div 
            className={`page ${theme}`} >
            <div className='container' style={{
            }}>
                <h3>Данные Пользователя:</h3>
                <Card className={`card ${theme}`} style={{ 
                    padding: '12px',
                    backgroundColor: theme === 'light' ? 'var(--card-light)' : 'var(--card-dark)', 
                    border: 'none',
                    color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    boxShadow: theme === 'light' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : '0px 4px 10px rgba(255, 255, 255, 0.1)',
                }}>
                    <Link
                        to={''}
                        style={{
                            backgroundColor: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
                            color: theme === 'light' ? 'var(--text-dark)' : 'var(--text-light)',
                            borderRadius: '12px',
                            padding: '10px',
                            width: '32px',
                            marginBottom: '10px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }} onClick={() => {
                            const newTheme = theme === 'light' ? 'dark' : 'light';
                            setTheme(newTheme);
                        } }                >
                        {theme === 'light' ? <SunOutlined /> : <MoonOutlined />}
                    </Link>
                    <Typography className={`input-label ${theme} big`}>
                        <strong>Имя пользователя:</strong> <b>{user?.username || 'Нет данных'}</b>
                    </Typography>
                    <Typography className={`input-label ${theme} big`}>
                        <strong>Telegram ID:</strong> <b>{user?.telegramId || 'Нет данных'}</b>
                    </Typography>
                    <Typography className={`input-label ${theme} big`}>
                        <strong>Номер телефона:</strong> <b>{user?.phoneNumber || 'Нет данных'}</b>
                    </Typography>
                    <Typography className={`input-label ${theme} big`}>
                        <strong>Полное имя:</strong> <b>{user?.fullName || 'Нет данных'}</b>
                    </Typography>
                    <Typography className={`input-label ${theme} big`}>
                        <strong>Роль:</strong> <b>{user?.role || 'Нет данных'}</b>
                    </Typography>
                </Card>
                <Card style={{ 
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
                    borderRadius: '32px',  
                }}>
                    <AnalyticsInfo clients={totalClients} deals={totalDeals} />
                </Card>
            </div>
            <NavBar />
        </div>
    );
};

export default MainPage;