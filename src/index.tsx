import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './index.scss';
import AnalyticsPage from './pages/AnalyticsPage';
import ClientsPage from './pages/ClientsPage';
import DealsPage from './pages/DealsPage';
import MainPage from './pages/MainPage';
import PaymentsPage from './pages/PaymentsPage';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <Router>
        <Routes>
            <Route element={<MainPage />} path='/' />
            <Route element={<ClientsPage />} path='/clients' />
            <Route element={<DealsPage />} path='/deals' />
            <Route element={<AnalyticsPage />} path='/analytics' />
            <Route element={<PaymentsPage />} path='/payments' />
        </Routes>
    </Router>
);