import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Select, Spin, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getClientById, updateClient } from '../../api';
import NavBar from '../../shared/components/NavBar/NavBar';
import { useThemeStore } from '../../shared/stores/theme';
import { ClientWithContacts, ContactColor, ContactType, TagColor, TagType } from '../../shared/types/types';

const ClientsInfoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const theme = useThemeStore((state) => state.theme);    
    const [client, setClient] = useState<ClientWithContacts | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedClient, setEditedClient] = useState<ClientWithContacts | null>(null);

    useEffect(() => {
        const fetchClient = async () => {
            setLoading(true);
            const data = await getClientById(id);
            setClient(data);
            setEditedClient(data);
            setLoading(false);
        };

        fetchClient();
    }, [id]);

    const handleSaveChanges = async () => {
        if (editedClient) {
            await updateClient(id, {
                name: editedClient.client.name,
                description: editedClient.client.description,
                tag: editedClient.client.tag,
                contacts: editedClient.contacts
            });
            setClient(editedClient);
            setIsEditModalOpen(false);
        }
    };

    const handleAddContact = () => {
        if (editedClient) {
            setEditedClient({
                ...editedClient,
                contacts: [...editedClient.contacts, {
                    clientId: editedClient.client.id,
                    id: uuidv4(), 
                    contact: '',
                    contactType: 'PHONE'
                }]
            });
        }
    };

    if (loading) {
        return (
            <div className={`page ${theme}`} style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!client) {
        return (
            <div className={`page ${theme}`}>
                <Typography.Text>Клиент не найден</Typography.Text>
            </div>
        );
    }

    return (
        <div className={`page ${theme}`} style={{ 
            overflowY: 'scroll', 
            paddingBottom: '0px'
        }}>
            <div className='container'>
                <h3>Данные клиента:</h3>
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
                            {client.client.name}
                        </Typography>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                        <Typography 
                            className={`input-label ${theme} big`} 
                            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                        >
                            <strong>Описание:</strong>
                            <span>
                                {client.client.description}
                            </span>
                        </Typography>
                        <Typography 
                            className={`input-label ${theme} big`}
                            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                        >
                            <strong>Тег:</strong>
                            <Tag 
                                color={TagColor[client.client.tag]} 
                                style={{ fontSize: '14px', alignSelf: 'start', marginTop: '4px' }}
                            >
                                {TagType[client.client.tag]}
                            </Tag>
                        </Typography>
                        <Typography className={`input-label ${theme} big`}>
                            <strong>Контакты:</strong>
                            <div 
                                style={{ 
                                    fontSize: '14px',
                                    listStyle: 'none',
                                    padding: 0,
                                    display: 'flex',
                                    gap: '6px',
                                    marginTop: '2px',
                                    marginBottom: '12px',
                                    flexDirection: 'column',
                                }}
                            >
                                {client.contacts.map(contact => (
                                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                                        <Tag 
                                            color={ContactColor[contact.contactType]}
                                            style={{ fontSize: '14px', alignSelf: 'center' }}
                                            onClick={() => {
                                                console.log(contact.contactType);
                                                if (contact.contactType === "TELEGRAM") {
                                                    window.open(`https://t.me/${contact.contact}`, '_blank');
                                                } else if (contact.contactType === "PHONE") {
                                                    window.open(`tel:${contact.contact}`, '_blank');
                                                }
                                            }}
                                        >
                                            {ContactType[contact.contactType]}
                                        </Tag>
                                        <strong style={{ marginRight: '4px' }}>{contact.contactType === "TELEGRAM" ? '@' : '+7'}{contact.contact}</strong> 
                                    </div>
                                ))}
                            </div>
                        </Typography>
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
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        Редактировать
                    </Button>
                </Card>
            </div>

            <Modal
                className={`modal-${theme}`}
                open={isEditModalOpen}
                title={<Typography className="modal-title">Редактирование клиента</Typography>}
                footer={[
                    <Button
                        danger
                        key="cancel" 
                        onClick={() => setIsEditModalOpen(false)}
                    >
                        Отмена
                    </Button>,
                    <Button 
                        key="save" 
                        style={{ backgroundColor: 'var(--accent-blue)' }} 
                        type="primary"
                        onClick={handleSaveChanges}
                    >
                        Сохранить
                    </Button>
                ]}
                onCancel={() => setIsEditModalOpen(false)}
            >
                {editedClient && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <Typography className="input-label">Имя клиента</Typography>
                            <Input
                                value={editedClient.client.name}
                                onChange={(e) => setEditedClient({
                                    ...editedClient,
                                    client: { ...editedClient.client, name: e.target.value }
                                })}
                            />
                        </div>
                        <div>
                            <Typography className="input-label">Описание</Typography>
                            <Input.TextArea
                                value={editedClient.client.description}
                                onChange={(e) => setEditedClient({
                                    ...editedClient,
                                    client: { ...editedClient.client, description: e.target.value }
                                })}
                            />
                        </div>
                        <div>
                            <Typography className="input-label">Тег</Typography>
                            <Select
                                allowClear
                                placeholder='Тег'
                                popupClassName={`select-${theme}`}
                                style={{ width: '100%' }}
                                value={TagType[editedClient.client.tag]}
                                options={Object.values(TagType).map((tag) => ({
                                    value: tag,
                                    label: TagType[tag],
                                }))}
                                onChange={(value) => setEditedClient({
                                    ...editedClient,
                                    client: { ...editedClient.client, tag: Object.keys(TagType).filter(key => TagType[key] === value)[0] }
                                })}
                            >
                                {Object.values(TagType).map((tag) => (
                                    <Select.Option key={tag} value={tag}>
                                        {tag}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                        {editedClient.contacts.map((contact, index) => (
                            <div key={contact.id}>
                                <Typography className="input-label">Контакт {index + 1}</Typography>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Input
                                        style={{ color: 'inherit' }}
                                        value={contact.contact}
                                        prefix={
                                            <span style={{ color: 'inherit' }}>
                                                {contact.contactType === "TELEGRAM" ? '@' : '+7'}
                                            </span>
                                        }
                                        onChange={(e) => {
                                            const newContacts = [...editedClient.contacts];
                                            newContacts[index].contact = e.target.value;
                                            setEditedClient({
                                                ...editedClient,
                                                contacts: newContacts
                                            });
                                        }}
                                    />
                                    <Select
                                        allowClear
                                        placeholder='Тип контакта'
                                        popupClassName={`select-${theme}`}
                                        style={{ width: '150px' }}
                                        value={ContactType[contact.contactType]}
                                        onChange={(value) => {
                                            const newContacts = [...editedClient.contacts];
                                            newContacts[index].contactType = Object.keys(ContactType).filter(key => ContactType[key] === value)[0];
                                            setEditedClient({
                                                ...editedClient,
                                                contacts: newContacts
                                            });
                                        }}
                                    >
                                        {Object.values(ContactType).map((type) => (
                                            <Select.Option key={type} value={type}>
                                                {type}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        ))}
                        <Button 
                            style={{ 
                                width: '100%', 
                                backgroundColor: theme === 'light' ? 'var(--button-light)' : 'var(--button-dark)',
                                border: 'none',
                                color: theme === 'dark' ? 'var(--text-dark)' : 'var(--text-dark)'
                            }}
                            onClick={handleAddContact}
                        >
                            Добавить контакт
                        </Button>
                    </div>
                )}
            </Modal>
            <NavBar />
        </div>
    );
};

export default ClientsInfoPage;
