import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, DatePicker, Input, Modal, Select, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { addReminder, getAllClients, getAllDeals, getReminders } from '../api';
import NavBar from '../shared/components/NavBar/NavBar';
import { useThemeStore } from '../shared/stores/theme';
import { ClientWithContacts, Deal, Notification, NotificationStatus, NotificationStatusRu, NotificationType, NotificationTypeRu } from '../shared/types/types';

const RemindersPage: React.FC = () => {
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const theme = useThemeStore((x) => x.theme);
    const [remindersData, setRemindersData] = useState<Notification[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reminderDate, setReminderDate] = useState<Date | null>(null);
    const [reminderMessage, setReminderMessage] = useState('');
    const [selectedType, setSelectedType] = useState<'client' | 'deal' | null>(null);
    const [clients, setClients] = useState<ClientWithContacts[]>([]);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const fetchReminders = async () => {
        const dateFrom = dateRange[0]?.format('YYYY-MM-DD');
        const dateTo = dateRange[1]?.format('YYYY-MM-DD');
        const reminders = await getReminders(dateFrom, dateTo);
        setRemindersData(reminders);
    };

    useEffect(() => {
        fetchReminders();
    }, [dateRange]);

    useEffect(() => {
        const fetchData = async () => {
            const clientsData = await getAllClients(1, 100);
            const dealsData = await getAllDeals(1, 100);
            setClients(clientsData.data || []);
            setDeals(dealsData.data || []);
        };
        fetchData();
    }, []);

    const handleAddReminder = async () => {
        if (!reminderDate || !reminderMessage || !selectedType || !selectedId) {
            return;
        }

        await addReminder({
            message: reminderMessage,
            reminderTime: reminderDate,
            status: NotificationStatus.ACTIVE,
            type: NotificationType.REMINDER,
            ...(selectedType === 'client' ? { clientId: selectedId } : { dealId: selectedId }),
            ...(selectedType === 'client' ? { clientName: clients.find((client) => client.client.id === selectedId)?.client.name } : { 
                dealTitle: deals.find((deal) => deal.id === selectedId)?.title,
                clientId: deals.find((deal) => deal.id === selectedId)?.clientId,
                clientName: deals.find((deal) => deal.id === selectedId)?.clientName
            })    
        } as Partial<Notification>);

        setIsModalOpen(false);
        setReminderDate(null);
        setReminderMessage('');
        setSelectedType(null);
        setSelectedId(null);
        fetchReminders();   
    };

    // Group reminders by date
    const groupedReminders = remindersData.reduce((acc, reminder) => {
        const date = dayjs(reminder.reminderTime?.toString()).format('DD.MM.YYYY');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(reminder);
        return acc;
    }, {} as Record<string, typeof remindersData>);

    return (
        <div className={`page ${theme}`} style={{ overflowY: 'scroll', paddingBottom: '0px' }}>
        <div className='container'>
            <h3>Напоминания: </h3>

            <DatePicker.RangePicker 
                style={{ marginBottom: '16px', width: '100%' }}
                onChange={(dates) => {
                    setDateRange([
                        dates?.[0] ?? null,
                        dates?.[1] ?? null
                    ]);
                }}
            />

            {/* Add Reminder Button */}
            <Button 
                block 
                type="primary" 
                style={{ 
                    width: '100%', 
                    padding: '10px', 
                    backgroundColor: 'var(--accent-blue)',
                    fontSize: '16px', 
                    height: '40px' 
                }}
                onClick={() => setIsModalOpen(true)}
            >
                <PlusOutlined />
                Добавить напоминание
            </Button>

            {/* Reminders List Grouped by Date */}
            {Object.entries(groupedReminders).map(([date, reminders]) => (
                <div key={date}>
                    <h2 className={`date-header ${theme}`} style={{ 
                        margin: '24px 0 16px 0',
                        textAlign: 'start',
                        fontSize: '1.2em',
                        fontWeight: 'bold' 
                    }}>
                    {dayjs(date, 'DD.MM.YYYY').format('D MMMM').replace('January', 'Января').replace('February', 'Февраля').replace('March', 'Марта').replace('April', 'Апреля').replace('May', 'Мая').replace('June', 'Июня').replace('July', 'Июля').replace('August', 'Августа').replace('September', 'Сентября').replace('October', 'Октября').replace('November', 'Ноября').replace('December', 'Декабря')}
                    </h2>
                    
                    {reminders.map((reminder) => (
                    <Card className={`${theme}`} key={reminder.id} style={{
                        padding: '20px',
                        backgroundColor: theme === 'light' ? 'var(--card-light)' : 'var(--card-dark)',
                        border: 'none',
                        borderRadius: '12px',
                        marginBottom: '16px',
                        boxShadow: theme === 'light' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : '0px 4px 10px rgba(255, 255, 255, 0.1)',
                    }}>
                        <h3 className={`input-label ${theme}`} style={{ margin: 0 }}>
                            {dayjs(reminder.reminderTime).format('HH:mm')}
                        </h3>
                        <p className={`input-label ${theme}`} style={{ opacity: 0.7, margin: '8px 0' }}>
                            {reminder.message}
                        </p>
                        
                        <Collapse 
                            ghost 
                            className={`collapse ${theme} header-notification`}
                            items={[
                                {
                                key: '1',
                                label: (
                                    <span style={{ 
                                        color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
                                        fontSize: '14px',
                                        padding: '0px'
                                    }}>
                                        Подробнее
                                    </span>
                                ),
                                children: (
                                    <div className={`details ${theme}`} style={{
                                        color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
                                        fontSize: '14px',
                                        textAlign: 'start',
                                        paddingLeft: '12px',
                                        padding: '0px'
                                    }}>
                                        <p>Статус: {NotificationStatusRu[reminder.status.toUpperCase() as keyof typeof NotificationStatusRu]}</p>
                                        <p>Тип: {NotificationTypeRu[reminder.type.toUpperCase() as keyof typeof NotificationTypeRu]}</p>
                                        <p>Создано: {dayjs(reminder.createdAt).subtract(1, 'hour').format('DD.MM.YYYY HH:mm')}</p>
                                        <p>
                                            Клиент: <Link to={`/clients/${reminder.clientId}`} style={{
                                                color: 'var(--accent-blue)',
                                                textDecoration: 'none'
                                            }}>{reminder.clientName}</Link>
                                        </p>
                                        {reminder.dealId && (
                                            <p>
                                                Сделка: <Link to={`/deals/${reminder.dealId}`} style={{
                                                color: 'var(--accent-blue)',
                                                textDecoration: 'none'
                                                }}>{reminder.dealTitle}</Link>
                                            </p>
                                        )}
                                    </div>
                                ),
                            },
                        ]}
                        style={{
                            background: 'transparent',
                            marginTop: '8px',
                            padding: '0px'
                        }}
                        />
                    </Card>
                    ))}
                </div>
                ))}
            </div>
            <Modal
                className={`modal-${theme}`}
                open={isModalOpen}
                title={<Typography className="modal-title">Создание напоминания</Typography>}
                footer={[
                    <Button
                        danger
                        key="cancel" 
                        onClick={() => setIsModalOpen(false)}
                    >
                        Отмена
                    </Button>,
                    <Button 
                        key="save" 
                        style={{ backgroundColor: 'var(--accent-blue)' }} 
                        type="primary"
                        onClick={handleAddReminder}
                    >
                        Создать
                    </Button>
                ]}
                onCancel={() => setIsModalOpen(false)}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <Typography className="input-label">Тип</Typography>
                        <Select
                            placeholder="Выберите тип"
                            popupClassName={`select-${theme}`}
                            style={{ width: '100%' }}
                            value={selectedType}
                            onChange={(value) => {
                                setSelectedType(value);
                                setSelectedId(null);
                            }}
                        >
                            <Select.Option value="client">Клиент</Select.Option>
                            <Select.Option value="deal">Сделка</Select.Option>
                        </Select>
                    </div>

                    {selectedType && (
                        <div>
                            <Typography className="input-label">
                                {selectedType === 'client' ? 'Клиент' : 'Сделка'}
                            </Typography>
                            
                            {selectedType === 'client' ? (
                                <Select
                                    placeholder="Выберите клиента"
                                    popupClassName={`select-${theme}`}
                                    style={{ width: '100%' }}
                                    value={selectedId}
                                    onChange={setSelectedId}
                                >
                                    {clients.map((client) => (
                                        <Select.Option key={client.client.id} value={client.client.id}>
                                            {client.client.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            ) : (
                                <Select
                                    placeholder="Выберите сделку"
                                    popupClassName={`select-${theme}`}
                                    style={{ width: '100%' }}
                                    value={selectedId}
                                    onChange={setSelectedId}
                                >
                                    {deals.map((deal) => (
                                        <Select.Option key={deal.id} value={deal.id}>
                                            {deal.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        </div>
                    )}

                    <div>
                        <Typography className="input-label">Дата и время</Typography>
                        <DatePicker
                            allowClear={true}
                            format="YYYY-MM-DD HH:mm"
                            style={{ width: '100%' }}
                            showTime={{
                                defaultValue: dayjs(new Date()).add(1, 'hour')
                            }}
                            onChange={(date) => setReminderDate(date?.toDate() || null)}
                        />
                    </div>
                    <div>
                        <Typography className="input-label">Сообщение</Typography>
                        <Input.TextArea
                            placeholder="Введите текст напоминания"
                            value={reminderMessage}
                            onChange={(e) => setReminderMessage(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>
            <NavBar />
        </div>
    );
}

export default RemindersPage;
