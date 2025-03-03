import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Select, Table, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useCallback, useEffect, useState } from 'react';
import { createDeal, getAllClients, getAllDeals, refreshTokens } from '../../api';
import { useThemeStore } from '../../shared/stores/theme';
import { ClientWithContacts, Deal } from '../../shared/types/types';

const DealsListPage: React.FC = () => {
    const theme = useThemeStore((x) => x.theme);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [clients, setClients] = useState<ClientWithContacts[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clientId, setClientId] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [size, setSize] = useState(10);
    const [title, setTitle] = useState('');
    const [income, setIncome] = useState('');
    const [currency, setCurrency] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchDeals();
        fetchClients();
    }, []);

    const fetchDeals = useCallback(async () => {
        const data = await getAllDeals(page, size);
        if (data.status === 401) {
            refreshTokens();
            const newData = await getAllDeals(page, size);
            setDeals(newData.data);
            setTotal(newData.totalCount);
        } else {
            setDeals(data.data);
            setTotal(data.totalCount);
        }
    }, [page, size]);

    const fetchClients = async () => {
        const data = await getAllClients(1, 1500);
        if (data.status === 401) {
            refreshTokens();
            await fetchClients();
        } else {
            setClients(data.data);
        }
    };

    const handleCreateDeal = async () => {
        const data = await createDeal({
            clientId,
            title,
            income,
            currency,
            notes,
        });
        if (data.status === 401) {
            refreshTokens();
            await createDeal({
                clientId,
                title,
                income,
                currency,
                notes,
            });
        } else {
            fetchDeals();
            setTitle('');
            setIncome('');
            setCurrency('');
            setClientId('');
            setNotes('');  
        }
        setNotes('');  
    };

    const columns = [
        { title: 'Название', dataIndex: 'title', key: 'title', width: '160px' },
        { title: 'Клиент', dataIndex: 'clientName', key: 'clientName', width: '160px' },
        { title: 'Доход', dataIndex: 'income', key: 'income', width: '100px' },
        { title: 'Валюта', dataIndex: 'currency', key: 'currency', width: '80px' },
        { title: 'Заметки', dataIndex: 'notes', key: 'notes', width: '160px' },
    ];

    return (
        <div className={`page ${theme}`} style={{ padding: '20px' }}>
            <h3>Сделки</h3>
            <Card 
                style={{ 
                    overflowX: 'auto', 
                    backgroundColor: theme === 'light' ? 'var(--primary-light)' : 'var(--secondary-dark)',
                    color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
                    textAlign: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    borderRadius: '10px',
                    fontSize: '16px',
                    height: '40px',
                    marginBottom: '10px',
                }}>
                <b>Количество сделок:</b> {total}
            </Card>
            <Button 
                type='primary' 
                style={{ marginBottom: '10px', width: '100%', padding: '10px', backgroundColor: 'var(--accent-blue)',
                    fontSize: '16px', height: '40px' }}
                onClick={() => setIsModalOpen(true)}
            >
                <PlusOutlined />
                Добавить сделку
            </Button>
            <Table
                bordered
                className={`table-${theme}`}
                columns={columns}
                dataSource={deals}
                key={deals.length}
                scroll={{ x: 700 }}
                style={{ width: '100%', borderRadius: '10px' }}
                pagination={{
                    current: page ? page : 1,  
                    pageSize: size ? size : 10, 
                    total: total,
                    pageSizeOptions: [10, 15, 20, 50, 100], 
                    size: 'small',
                    showTotal: (_, range) => `${range[0]}-${range[1]} из ${total}`,
                    onChange: (current, pageSize) => {
                        setPage(current);
                        setSize(pageSize);
                    },
                }}
            />
            <Modal
                className={`modal-${theme}`}
                destroyOnClose={true}
                footer={null}
                open={isModalOpen}
                title={<Typography className={`modal-title`}>Создание клиента</Typography>}
                onCancel={() => {
                    setIsModalOpen(false);
                    setTitle('');
                    setIncome('');
                    setCurrency('');
                    setClientId('');
                    setNotes('');   
                }}
                onClose={() => {
                    setIsModalOpen(false);
                    setTitle('');
                    setIncome('');
                    setCurrency('');
                    setClientId('');
                    setNotes('');   
                }}
                onOk={() => {
                    setIsModalOpen(false);
                    setTitle('');
                    setIncome('');
                    setCurrency('');
                    setClientId('');
                    setNotes('');  
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                    <div style={{ width: '100%' }}>
                        <Typography className={`input-label`}>Название сделки</Typography>
                        <Input
                            placeholder='Название сделки'
                            type='text'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div style={{ width: '100%' }}>
                        <Typography className={`input-label`}>Клиент</Typography>
                        <Select
                            placeholder='Клиент'
                            popupClassName={`select-${theme}`}
                            style={{ width: '100%' }}
                            value={clientId}
                            options={clients.map((client) => ({
                                value: client.client.id,
                                label: client.client.name,
                            }))}
                            onChange={(value) => {
                                setClientId(value);
                            }}
                        />
                    </div>
                    <div style={{ width: '100%' }}>
                        <Typography className={`input-label`}>Доход</Typography>
                        <Input
                            placeholder='Доход'
                            type='text'
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                        />
                    </div>
                    <div style={{ width: '100%' }}>
                        <Typography className={`input-label`}>Валюта</Typography>
                        <Select
                            placeholder='Валюта'
                            popupClassName={`select-${theme}`}
                            style={{ width: '100%' }}
                            value={currency}
                            options={['RUB', 'USD', 'TON'].map((currency) => ({
                                value: currency,
                                label: currency,
                            }))}    
                            onChange={(value) => {
                                setCurrency(value);
                            }}
                        />
                    </div>
                    <div style={{ width: '100%' }}>
                        <Typography className={`input-label`}>Описание</Typography>
                        <TextArea
                            placeholder='Описание'
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <Button 
                        type='primary' 
                        style={{ marginBottom: '10px', width: '100%', padding: '10px',
                        fontSize: '16px', height: '40px' }}
                        onClick={() => {
                            handleCreateDeal();
                            setIsModalOpen(false);
                        }}
                    >
                        Создать сделку
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default DealsListPage; 
