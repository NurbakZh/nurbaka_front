import { CalendarOutlined, CloseOutlined, CheckOutlined, DeleteOutlined, EditOutlined, DollarCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, Input, Modal, Select, Spin, Tag, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addReminder, createPayment, getAllClients, getDealById, updateDeal } from '../../api';
import NavBar from '../../shared/components/NavBar/NavBar';
import { useThemeStore } from '../../shared/stores/theme';
import { ClientWithContacts, Deal, DealStatus, NotificationStatus, NotificationType } from '../../shared/types/types';

const DealsInfoPage: React.FC = () => {
    const theme = useThemeStore((state) => state.theme);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [deal, setDeal] = useState<Deal | null>(null);
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState<ClientWithContacts[]>([]);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [reminderDate, setReminderDate] = useState<Date | null>(null);
    const [reminderMessage, setReminderMessage] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        fetchDeal();
        fetchClients();
    }, [id]);

    const fetchClients = async () => {
        try {
            const data = await getAllClients(1, 1000);
            setClients(data.data);
        } catch (error) {
            message.error('Ошибка при загрузке клиентов');
        }
    };

    const fetchDeal = async () => {
        try {
            setLoading(true);
            const data = await getDealById(id);
            setDeal(data);
            form.setFieldsValue({
                title: data.title,
                income: data.income,
                currency: data.currency,
                notes: data.notes,
                clientId: data.clientId,
                clientName: data.clientName
            });
        } catch (error) {
            message.error('Ошибка при загрузке сделки');
        } finally {
            setLoading(false);
        }
    };

    const handlePutOnHold = async () => {
        try {
            await updateDeal(id, { status: "SUSPENDED" });
            await fetchDeal();
            message.success('Сделка успешно отложена');
        } catch (error) {
            message.error('Ошибка при отложении сделки');
        }
    };

    const handleCompleteDeal = async () => {
        try {
            await updateDeal(id, { status: "SUCCESS" });
            await fetchDeal();
            message.success('Сделка успешно завершена');
        } catch (error) {
            message.error('Ошибка при завершении сделки');
        }
    };

    const handleCancelDeal = async () => {
        try {
            await updateDeal(id, { status: "FAILED" });
            await fetchDeal();
            message.success('Сделка успешно отменена');
        } catch (error) {
            message.error('Ошибка при отмене сделки');
        }
    };

    const handleEdit = async (values: any) => {
        try {
            const clientName = clients.find(client => client.client.id === values.clientId)?.client.name;
            await updateDeal(id, { ...values, clientName });
            await fetchDeal();
            setIsEditingModalOpen(false);
            message.success('Сделка успешно обновлена');
        } catch (error) {
            message.error('Ошибка при обновлении сделки');
        }
    };

    const handleCreateInvoice = async () => {
        try {
            const originalAmount = deal?.currency === 'RUB' ? Number(deal?.income) / 242 : deal?.currency === 'USD' ? Number(deal?.income) / 2.72 : Number(deal?.income);
            const baseAmountRub = deal?.currency === 'RUB' ? Number(deal?.income) : deal?.currency === 'USD' ? Number(deal?.income) * 87 : Number(deal?.income) * 242;
            const baseAmountUsd = deal?.currency === 'RUB' ? Number(deal?.income) / 87 : deal?.currency === 'USD' ? Number(deal?.income) : Number(deal?.income) * 2.72;
            await createPayment({
                dealId: id,
                clientId: deal?.clientId,
                createdAt: deal?.createdAt,
                originalAmount: originalAmount.toString(),
                baseAmountRub: baseAmountRub.toString(),
                baseAmountUsd: baseAmountUsd.toString(),
                paymentMethod: 'card',
                paymentUrl: 'pay.com',
                status: "UNPAID",
                paidAmount: null,
                paidAt: null,
            });
            await fetchDeal();
            message.success('Счет успешно выставлен');
        } catch (error) {
            message.error('Ошибка при выставлении счета');
        }
    };

    const handleRestore = async () => {
        try {
            await updateDeal(id, { status: "IN_PROGRESS" });
            await fetchDeal();
            message.success('Сделка успешно восстановлена');
        } catch (error) {
            message.error('Ошибка при восстановлении сделки');
        }
    };

    const handleAddReminder = async () => {
        if (!reminderDate || !reminderMessage) {
            return;
        }

        await addReminder({
            message: reminderMessage,
            reminderTime: reminderDate,
            status: NotificationStatus.ACTIVE,
            type: NotificationType.REMINDER,
            dealId: id,
            dealTitle: deal?.title,
            clientId: deal?.clientId,
            clientName: deal?.clientName
        } as Partial<Notification>);
        setIsReminderModalOpen(false);
        setReminderDate(null);
        setReminderMessage('');
    };

    if (loading) {
        return (
            <div className={`page ${theme}`}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    if (!deal) {
        return (
            <div className={`page ${theme}`}>
                <div className="container">
                    <Typography.Text>Сделка не найдена</Typography.Text>
                </div>
            </div>
        );
    }

    return (
        <div className={`page ${theme}`}>
            <div className='container'>
                <h3>Данные сделки:</h3>
                <Card className={`card ${theme}`} style={{ 
                    padding: '20px',
                    backgroundColor: theme === 'light' ? 'var(--card-light)' : 'var(--card-dark)', 
                    border: 'none',
                    color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    boxShadow: theme === 'light' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : '0px 4px 10px rgba(255, 255, 255, 0.1)',
                }}>
                    <div 
                        style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            flexDirection: 'column',
                            gap: '10px',
                            alignItems: 'start', 
                            marginBottom: '20px'
                        }}>
                        <Typography 
                            className={`heading-label ${theme}`} 
                            style={{ fontSize: '24px', margin: 0, lineHeight: '32px' }}
                        >
                            {deal.title}
                        </Typography>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}> 
                        <Typography 
                            className={`input-label ${theme} big`}
                            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                        >
                            <strong>Доход:</strong>
                            <span>
                                {deal.income} {deal.currency}
                            </span>
                        </Typography>
                        <Typography 
                            className={`input-label ${theme} big`}
                            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                        >
                            <strong>Статус:</strong>
                            <span>
                            <Tag 
                                color={deal.status === 'IN_PROGRESS' ? 'blue' : deal.status === 'SUSPENDED' ? 'orange' : deal.status === 'SUCCESS' ? 'green' : deal.status === 'WAITING_FOR_PAYMENT' ? 'yellow' : 'red'}
                                style={{ fontSize: '14px' }}>
                                {DealStatus[deal.status as unknown as keyof typeof DealStatus]}
                            </Tag>
                            </span>
                        </Typography>
                        <Typography 
                            className={`input-label ${theme} big`}
                            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                        >
                            <strong>Дата создания:</strong>
                            <span>
                                {new Date(deal.createdAt).toLocaleDateString('ru-RU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                            </span>
                        </Typography>
                        <Typography 
                            className={`input-label ${theme} big`}
                            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                        >
                            <strong>Планируемая дата закрытия:</strong>
                            <span>
                                {deal.plannedTill ? new Date(deal.plannedTill).toLocaleDateString('ru-RU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                }) : 'Нет планируемой даты'}
                            </span>
                        </Typography>
                        <Typography 
                            className={`input-label ${theme} big`}
                            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                        >
                            <strong>Заметки:</strong>
                            <span>
                                {deal.notes || 'Нет заметок'}
                            </span>
                        </Typography>
                        <div>
                            <Typography 
                                className={`input-label ${theme} big`}
                                style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                            >
                                <strong>Клиент:</strong>
                                {deal.clientId ? (
                                    <Link 
                                        to={`/clients/${deal.clientId}`} 
                                        style={{ 
                                            color: 'inherit', 
                                            textDecoration: 'underline',
                                            fontWeight: 'bold'
                                        }}>
                                        {deal.clientName}
                                    </Link>
                                ) : (
                                    'Не назначен'
                                )}
                            </Typography>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center', 
                        flexDirection: 'column',
                        gap: '4px'
                    }}>
                        <Button 
                            icon={<EditOutlined />}
                            type="primary"
                            style={{ 
                                backgroundColor: theme === 'light' ? 'var(--button-light)' : 'var(--button-dark)', 
                                color: theme === 'dark' ? 'var(--text-dark)' : 'var(--text-dark)',
                                marginTop: '16px',
                                height: '28px',
                                width: '60%',
                                boxShadow: 'none'
                            }}
                            onClick={() => setIsEditingModalOpen(true)}
                        >
                            Редактировать
                        </Button>
                        {deal.status === "IN_PROGRESS" && 
                            <Button 
                                danger
                                icon={<CloseOutlined />}
                                type="primary"
                                style={{ 
                                    color: 'var(--text-dark)',
                                    height: '28px',
                                    width: '60%',
                                    boxShadow: 'none'
                                }}
                                onClick={() => handlePutOnHold()}
                            >
                                Отложить
                            </Button>
                        }
                        {deal.status === "IN_PROGRESS" && 
                            <Button 
                                icon={<DollarCircleOutlined />}
                                type="primary"
                                style={{ 
                                    backgroundColor: 'var(--accent-yellow)', 
                                    color: 'var(--text-dark)',
                                    height: '28px',
                                    width: '60%',
                                    boxShadow: 'none'
                                }}
                                onClick={() => handleCreateInvoice()}
                            >
                                Выставить счет
                            </Button>
                        }
                        {deal.status === "SUSPENDED" && 
                            <Button
                                icon={<RedoOutlined />}
                                type="primary"
                                style={{ 
                                    backgroundColor: 'var(--success-green)', 
                                    color: 'var(--text-dark)',
                                    height: '28px',
                                    width: '60%',
                                    boxShadow: 'none'
                                }}
                                onClick={() => handleRestore()}
                            >
                                Восстановить
                            </Button>
                        }
                        {deal.status === "WAITING_FOR_PAYMENT" && 
                            <Button 
                                icon={<CheckOutlined />}
                                type="primary"
                                style={{ 
                                    backgroundColor: 'var(--success-green)', 
                                    color: 'var(--text-dark)',
                                    height: '28px',
                                    width: '60%',
                                    boxShadow: 'none'
                                }}
                                onClick={() => handleCompleteDeal()}
                            >
                                Завершить сделку
                            </Button>
                        }
                        {deal.status === "WAITING_FOR_PAYMENT" && 
                            <Button 
                                icon={<DeleteOutlined />}
                                type="primary"
                                style={{ 
                                    backgroundColor: 'var(--error-red)', 
                                    color: 'var(--text-dark)',
                                    height: '28px',
                                    width: '60%',
                                    boxShadow: 'none'
                                }}
                                onClick={() => handleCancelDeal()}
                            >
                                Отменить сделку
                            </Button>
                        }
                        <Button 
                            icon={<CalendarOutlined />}
                            type="primary"
                            style={{ 
                                backgroundColor: 'var(--accent-blue)', 
                                color: 'var(--text-dark)',
                                height: '28px',
                                width: '60%',
                                boxShadow: 'none'
                            }}
                            onClick={() => setIsReminderModalOpen(true)}
                        >
                            Добавить напоминание
                        </Button>
                    </div>
                </Card>
            </div>
            <Modal
                className={`modal-${theme}`}
                open={isEditingModalOpen}
                title={<Typography className="modal-title">Редактирование сделки</Typography>}
                footer={[
                    <Button 
                        danger
                        key="cancel" 
                        onClick={() => setIsEditingModalOpen(false)}
                    >
                        Отмена
                    </Button>,
                    <Button 
                        key="save" 
                        style={{ backgroundColor: 'var(--accent-blue)' }} 
                        type="primary"
                        onClick={() => form.submit()}
                    >
                        Сохранить
                    </Button>
                ]}
                onCancel={() => setIsEditingModalOpen(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEdit}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Form.Item
                            label={<Typography className="input-label">Название сделки</Typography>}
                            name="title"
                            rules={[{ required: true, message: 'Введите название сделки' }]}
                            style={{marginBottom: '0px'}}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={<Typography className="input-label">Доход</Typography>}
                            name="income"
                            rules={[{ required: true, message: 'Введите доход' }]}
                            style={{marginBottom: '0px'}}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            label={<Typography className="input-label">Валюта</Typography>}
                            name="currency"
                            rules={[{ required: true, message: 'Выберите валюту' }]}
                            style={{marginBottom: '0px'}}
                        >
                            <Select popupClassName={`select-${theme}`}>
                                <Select.Option value="RUB">RUB</Select.Option>
                                <Select.Option value="USD">USD</Select.Option>
                                <Select.Option value="EUR">EUR</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={<Typography className="input-label">Клиент</Typography>}
                            name="clientId"
                            style={{marginBottom: '0px'}}
                        >
                            <Select
                                placeholder='Клиент'
                                popupClassName={`select-${theme}`}
                                style={{ width: '100%' }}
                                value={deal.clientId}
                                options={clients.map((client) => ({
                                    value: client.client.id,
                                    label: client.client.name,
                                }))}
                                onChange={(value) => {
                                    form.setFieldsValue({ clientId: value });
                                    form.setFieldsValue({ clientName: clients.find(client => client.client.id === value)?.client.name });
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={<Typography className="input-label">Заметки</Typography>}
                            name="notes"
                            style={{marginBottom: '0px'}}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            <Modal
                className={`modal-${theme}`}
                open={isReminderModalOpen}
                style={{ width: '400px' }}
                title={<Typography className="modal-title">Создание напоминания</Typography>}
                footer={[
                    <Button
                        danger
                        key="cancel" 
                        onClick={() => setIsReminderModalOpen(false)}
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
                onCancel={() => setIsReminderModalOpen(false)}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <Typography className="input-label">Дата и время</Typography>
                        <DatePicker
                            format="YYYY-MM-DD HH:mm:ss"
                            showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                            style={{ width: '100%' }}  
                            onChange={(date) => setReminderDate(date.toDate())}
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
};

export default DealsInfoPage;
