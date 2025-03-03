import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import React, { useEffect, useState } from 'react';
import NavBar from '../shared/components/NavBar/NavBar';
import { useThemeStore } from '../shared/stores/theme';

const MainPage: React.FC = () => {
    const { setTheme } = useThemeStore();
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
                const response = await fetch('http://localhost:3000/api/users', {
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
        <div className={`page ${theme}`}>
            <Link
                style={{ 
                    backgroundColor: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
                    color: theme === 'light' ? 'var(--text-dark)' : 'var(--text-light)',
                    borderRadius: '50%',
                    padding: '10px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={() => {
                    const newTheme = theme === 'light' ? 'dark' : 'light';
                    setTheme(newTheme);
                }}
            >
                {theme === 'light' ? <SunOutlined /> : <MoonOutlined />}
            </Link>
            <NavBar />
            <h2>Обзор API Эндпоинтов</h2>
            <h3>Данные Пользователя</h3>
            <p>Telegram ID: <b>{user?.telegramId || 'Нет данных'}</b></p>
            <p>Имя пользователя: <b>{user?.username || 'Нет данных'}</b></p>
            <p>Номер телефона: <b>{user?.phoneNumber || 'Нет данных'}</b></p>
            <p>Полное имя: <b>{user?.fullName || 'Нет данных'}</b></p>
            <p>Роль: <b>{user?.role || 'Нет данных'}</b></p>
        </div>
    );
};

export default MainPage;