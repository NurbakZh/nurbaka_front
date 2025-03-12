import { Input, Select, Typography } from 'antd';
import React from 'react';
import { useThemeStore } from '../../shared/stores/theme';
import { DealStatus } from '../../shared/types/types';

interface DealFilterFormProps {
    changeTitle: (title: string) => void;
    changeClient: (clientId: string) => void;
    changeIncome: (income: string) => void;
    changeCurrency: (currency: string) => void;
    changeStatus: (status: string) => void;
    clients: { id: string; name: string }[]; 
}

const DealFilterForm: React.FC<DealFilterFormProps> = ({ changeTitle, changeClient, changeIncome, changeCurrency, changeStatus, clients }) => {
    const theme = useThemeStore((state) => state.theme);
    return (
        <div className={`filter-form ${theme}`} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '100%' }}>
                <Typography className={`input-label ${theme}`}>Статус</Typography>
                <Select
                    placeholder='Статус'
                    popupClassName={`select-${theme}`}
                    style={{ width: '100%' }}
                    options={[{ value: '', label: '' }, ...Object.keys(DealStatus).map((status) => ({
                        value: status,
                        label: DealStatus[status as keyof typeof DealStatus],
                    }))]}
                    onChange={(value) => changeStatus(value)}
                />
            </div>
            <div style={{ width: '100%' }}>
                <Typography className={`input-label ${theme}`}>Название сделки</Typography>
                <Input placeholder='Название сделки' type='text' onChange={(e) => changeTitle(e.target.value)} />
            </div>
            <div style={{ width: '100%' }}>
                <Typography className={`input-label ${theme}`}>Клиент</Typography>
                <Select
                    placeholder='Клиент'
                    popupClassName={`select-${theme}`}
                    style={{ width: '100%' }}
                    options={[{ value: '', label: '' }, ...clients.map((client) => ({
                        value: client.id,
                        label: client.name,
                    }))]}
                    onChange={(value) => changeClient(value)}
                />
            </div>
            <div style={{ width: '100%' }}>
                <Typography className={`input-label ${theme}`}>Доход</Typography>
                <Input placeholder='Доход' type='text' onChange={(e) => changeIncome(e.target.value)} />
            </div>
            <div style={{ width: '100%' }}>
                <Typography className={`input-label ${theme}`}>Валюта</Typography>
                <Select
                    placeholder='Валюта'
                    popupClassName={`select-${theme}`}
                    style={{ width: '100%' }}
                    options={['', 'RUB', 'USD', 'TON'].map((currency) => ({
                        value: currency,
                        label: currency,
                    }))}
                    onChange={(value) => changeCurrency(value)}
                />
            </div>
        </div>
    );
};

export default DealFilterForm;
