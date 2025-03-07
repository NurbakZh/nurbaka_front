import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, DatePicker, Input, Modal, Select, Table, Tag, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDeal, getAllClients, getAllDeals } from '../../api';
import DealFilterForm from '../../components/Deals/DealFilterForm';
import { useThemeStore } from '../../shared/stores/theme';
import { ClientWithContacts, Deal, DealStatus } from '../../shared/types/types';

const DealsListPage: React.FC = () => {
    const navigate = useNavigate();
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
    const [titleFilter, setTitleFilter] = useState('');
    const [clientIdFilter, setClientIdFilter] = useState('');
    const [incomeFilter, setIncomeFilter] = useState('');
    const [currencyFilter, setCurrencyFilter] = useState('');
    const [plannedTill, setPlannedTill] = useState<Date | null>(null);

    useEffect(() => {
        fetchDeals(
            titleFilter,
            clientIdFilter,
            incomeFilter,
            currencyFilter
        );
        fetchClients();
    }, [titleFilter, clientIdFilter, incomeFilter, currencyFilter]);

    const fetchDeals = useCallback(async (title?: string, clientId?: string, income?: string, currency?: string) => {
        const data = await getAllDeals(page, size, title, clientId, income, currency);
        setDeals(data.data);
        setTotal(data.totalCount);
    }, [page, size]);

    const fetchClients = async () => {
        const data = await getAllClients(1, 1500);
        setClients(data.data);
    };

    const handleCreateDeal = async () => {
        await createDeal({
            clientId,
            title,
            income,
            currency,
            notes,
            plannedTill,
        });
        fetchDeals();
        setTitle('');
        setIncome('');
        setCurrency('');
        setClientId('');
        setNotes('');  
        setPlannedTill(null);
    };

    const columns = [
        { title: 'Название', dataIndex: 'title', key: 'title', width: '160px' },
        { title: 'Клиент', dataIndex: 'clientName', key: 'clientName', width: '160px' },
        { title: 'Статус', dataIndex: 'status', key: 'status', width: '160px', 
            render: (text: string) => {
                return <Tag 
                    color={DealStatus[text as keyof typeof DealStatus] === 'В процессе' ? 'blue' : text === 'Отложен' ? 'yellow' : text === 'Успех' ? 'green' : 'red'}>
                        {DealStatus[text as keyof typeof DealStatus]}
                    </Tag>
            }},
        { title: 'Доход', dataIndex: 'income', key: 'income', width: '100px' },
        { title: 'Валюта', dataIndex: 'currency', key: 'currency', width: '80px' },
        { title: 'Заметки', dataIndex: 'notes', key: 'notes', width: '160px' },
        { title: 'Дата создания', dataIndex: 'createdAt', key: 'createdAt', width: '160px', render: (text: string) => dayjs(text).format('DD.MM.YYYY') },
        { title: 'Планируемая дата закрытия', dataIndex: 'plannedTill', key: 'plannedTill', width: '190px', render: (text: string) => text ? dayjs(text).format('DD.MM.YYYY') : 'Нет планируемой даты' },
    ];

    return (
        <div className={`page ${theme}`}>
            <div className='container'>
                <h3>Сделки:</h3>
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
                    style={{ width: '100%', padding: '10px', backgroundColor: 'var(--accent-blue)',
                        fontSize: '16px', height: '40px' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusOutlined />
                    Добавить сделку
                </Button>
                <Collapse ghost className={`collapse ${theme}`}  items={[
                    {
                        key: '1',
                        label: <Typography className={`heading-label ${theme}`}>Фильтры:</Typography>,
                        children: <DealFilterForm 
                            changeClient={setClientIdFilter}
                            changeCurrency={setCurrencyFilter}
                            changeIncome={setIncomeFilter}
                            changeTitle={setTitleFilter}
                            clients={clients.map(client => ({ id: client.client.id, name: client.client.name }))}
                        />,
                    },
                ]} />
                <Table
                    bordered
                    className={`table-${theme}`}
                    columns={columns}
                    dataSource={deals}
                    key={deals.length}
                    scroll={{ x: 900 }}
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
                    onRow={(record) => ({
                        onClick: () => {
                            navigate(`/deals/${record.id}`);
                        },
                    })}
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
                        <div style={{ width: '100%' }}>
                            <Typography className={`input-label`}>Дата закрытия</Typography>
                            <DatePicker
                                className={`date-picker ${theme}`}
                                minDate={dayjs()}
                                placeholder='Планируемая дата закрытия'
                                placement='topRight'
                                style={{ 
                                    width: '100%'
                                }}
                                onChange={(value) => setPlannedTill(value?.toDate() || null)}
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
        </div>
    );
};

export default DealsListPage; 
