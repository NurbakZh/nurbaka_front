import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './index.scss';
import AnalyticsPage from './pages/AnalyticsPage';
import ClientsInfoPage from './pages/Clients/ClientsInfoPage';
import ClientsPage from './pages/Clients/ClientsPage';
import DealsInfoPage from './pages/Deals/DealsInfoPage';
import DealsPage from './pages/Deals/DealsPage';
import MainPage from './pages/MainPage';
import PaymentsPage from './pages/PaymentsPage';
import RemindersPage from './pages/RemindersPage';
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const setViewportHeight = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
};
window.addEventListener('resize', setViewportHeight);
setViewportHeight();

root.render(
    <Router>
        <Routes>
            <Route element={<MainPage />} path='/' />
            <Route element={<ClientsPage />} path='/clients' />
            <Route element={<DealsPage />} path='/deals' />
            <Route element={<AnalyticsPage />} path='/analytics' />
            <Route element={<RemindersPage />} path='/reminders' />
            <Route element={<PaymentsPage />} path='/payments' />
            <Route element={<ClientsInfoPage />} path='/clients/:id' />
            <Route element={<DealsInfoPage />} path='/deals/:id' />
        </Routes>
    </Router>
);