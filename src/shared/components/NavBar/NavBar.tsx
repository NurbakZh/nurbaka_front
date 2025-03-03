import { BarChartOutlined, CreditCardOutlined, FileOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../../stores/theme';
import './NavBar.scss';

const NavBar: React.FC = () => {
    const theme = useThemeStore((x) => x.theme);

    return (
        <div className={`navbar ${theme}`}>
            <Link className={`navbar-item ${theme}`} to='/'>
                <HomeOutlined />
                Главная
            </Link>
            <Link className={`navbar-item ${theme}`} to='/clients'>
                <UserOutlined />
                Клиенты
            </Link>
            <Link className={`navbar-item ${theme}`} to='/deals'>
                <FileOutlined />
                Сделки
            </Link>
            <Link className={`navbar-item ${theme}`} to='/analytics'>
                <BarChartOutlined />
                Аналитика
            </Link>
            <Link className={`navbar-item ${theme}`} to='/payments' >
                <CreditCardOutlined />
                Платежи
            </Link>
        </div>
    );
};

export default NavBar;