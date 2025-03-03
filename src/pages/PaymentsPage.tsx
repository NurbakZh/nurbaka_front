import React, { useState } from 'react';
import NavBar from '../shared/components/NavBar/NavBar';

const PaymentsPage: React.FC = () => {
    const [paymentId, setPaymentId] = useState('');
    const [amount, setAmount] = useState('');

    const handleCreatePayment = () => {
        // Call API to create payment
    };

    return (
        <div className='page'>
            <h1>Страница Платежей</h1>
            <NavBar />
            <h2>API Эндпоинты для Платежей</h2>
            <ul>
                <li><strong>Создать Платеж:</strong> POST /api/payments</li>
                <li><strong>Получить Все Платежи:</strong> GET /api/payments</li>
                <li><strong>Получить Платеж по ID:</strong> GET /api/payments/:id</li>
                <li><strong>Обновить Платеж:</strong> PUT /api/payments/:id</li>
                <li><strong>Удалить Платеж:</strong> DELETE /api/payments/:id</li>
            </ul>
            <h3>Создать Платеж</h3>
            <input 
                placeholder='Сумма' 
                type='text' 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
            />
            <button onClick={handleCreatePayment}>Создать</button>
        </div>
    );
};

export default PaymentsPage;