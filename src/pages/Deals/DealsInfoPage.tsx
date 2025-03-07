import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Select, Spin, Tag, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteDeal, getAllClients, getDealById, updateDeal } from '../../api';
import NavBar from '../../shared/components/NavBar/NavBar';
import { useThemeStore } from '../../shared/stores/theme';
import { ClientWithContacts, Deal, DealStatus } from '../../shared/types/types';

const DealsInfoPage: React.FC = () => {
    const theme = useThemeStore((state) => state.theme);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [deal, setDeal] = useState<Deal | null>(null);
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState<ClientWithContacts[]>([]);
    const [editingClient, setEditingClient] = useState(false);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalOpen] = useState(false);
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

    const handleDelete = async () => {
        try {
            await deleteDeal(id);
            message.success('Сделка успешно удалена');
            navigate('/deals');
        } catch (error) {
            message.error('Ошибка при удалении сделки');
        }
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
                                color={DealStatus[deal.status as unknown as keyof typeof DealStatus] === 'В процессе' ? 'blue' : deal.status === 'Отложен' ? 'yellow' : deal.status === 'Успех' ? 'green' : 'red'}
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
            <NavBar />
        </div>
    );
};

export default DealsInfoPage;
