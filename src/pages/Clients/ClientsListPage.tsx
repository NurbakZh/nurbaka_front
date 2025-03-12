import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Input, Modal, notification, Popconfirm, Select, Table, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient, deleteClient, getAllClients } from '../../api';
import ClientFilterForm from '../../components/Clients/ClientFilterForm';
import { useThemeStore } from '../../shared/stores/theme';
import { Client, ClientWithContacts, Contact, ContactColor, ContactType, TagColor, TagType } from '../../shared/types/types';

const ClientsListPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useThemeStore((x) => x.theme);
    const [clients, setClients] = useState<ClientWithContacts[]>([]);
    const [total, setTotal] = useState(0);  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contactType, setContactType] = useState<ContactType | null>(ContactType.TELEGRAM);
    const [clientName, setClientName] = useState('');
    const [clientDescription, setClientDescription] = useState('');
    const [clientTag, setClientTag] = useState<TagType | null>(null);
    const [clientContact, setClientContact] = useState('');
    const [contactTypeFilter, setContactTypeFilter] = useState<ContactType | null>(null);
    const [clientNameFilter, setClientNameFilter] = useState('');
    const [clientDescriptionFilter, setClientDescriptionFilter] = useState('');
    const [clientTagFilter, setClientTagFilter] = useState<TagType | null>(null);
    const [clientContactFilter, setClientContactFilter] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        fetchClients();
    }, [page, size]);

    useEffect(() => {
        fetchClients(
            clientNameFilter,
            clientDescriptionFilter,
            Object.keys(TagType).filter(key => TagType[key] === clientTagFilter)[0],
            clientContactFilter,
            Object.keys(ContactType).filter(key => ContactType[key] === contactTypeFilter)[0]
        );
    }, [clientNameFilter, clientDescriptionFilter, clientTagFilter, clientContactFilter, contactTypeFilter]);

    const fetchClients = useCallback(async (name?: string, description?: string, tag?: string, contact?: string, contactType?: string) => {
        const data = await getAllClients(page, size, name, description, tag, contact, contactType);
        setClients(data.data);
        setTotal(data.totalCount);
    }, [page, size]);

    const handleCreateClient = async () => {
        try {
            const response = await createClient({
                name: clientName,
                description: clientDescription,
                tag: Object.keys(TagType).filter(key => TagType[key] === clientTag)[0],
                contacts: [{ contact: clientContact, contactType: Object.keys(ContactType).filter(key => ContactType[key] === contactType)[0] }],
            });
            if (response.status === 200 || response.status === 201 || response.status === 204) {
                fetchClients();
                setIsModalOpen(false);
                refreshForm();
            } else {
                throw new Error("409 Conflict");
            }
        } catch (error) {
            console.log(error);
            notification.error({
                message: 'Клиент с таким именем уже существует',
                duration: 3,
                showProgress: true,
                className:
                theme === 'light'
                    ? 'custom-notification-light'
                    : 'custom-notification-dark',
            }); 
        }
    };

    const handleDeleteClient = async (id: string) => {
        await deleteClient(id);
        fetchClients();
    };

    
    const columns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Тег',
            dataIndex: 'tag',
            key: 'tag',
            render: (tag: TagType) => (
                <Tag color={TagColor[tag]}>{TagType[tag]}</Tag>
            ),
        },
        {
            title: 'Контакт',
            dataIndex: 'contacts',
            key: 'contacts',
            render: (contacts: Contact[]) => (
                <>
                    {contacts.map((contact: Contact) => (
                        <div key={contact.id + "key"}>{contact.contact}</div>
                    ))}
                </>
            ),
        },
        {
            title: 'Тип контакта',
            dataIndex: 'contacts',
            key: 'contactsType',
            render: (contacts: Contact[]) => (
                <>
                    {contacts.map((contact: Contact) => {
                        const contactType = contact.contactType.toUpperCase();
                        return <Tag color={ContactColor[contactType]}>{ContactType[contactType]}</Tag>
                    })}
                </>
            ),
        },
        {
            title: 'Действия',
            key: 'client',
            onCell: () => {
                return {
                  onClick: (event) => {
                    event.stopPropagation();
                  }
                }
              },
            render: (client: Client) => {
                return !client.hasDeal ? (
                    <Popconfirm
                        arrow={false}
                        placement='topRight'
                        title={"Вы уверены что хотите удалить клиента?"}
                        onConfirm={() => {
                            handleDeleteClient(client.id)
                        }}
                    >
                        <Button 
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Удалить
                        </Button>
                    </Popconfirm>
                ) : null;
            },
        },
    ];

    const refreshForm = () => {
        setIsModalOpen(false);
        setClientName('');
        setClientDescription('');
        setClientTag(null);
        setClientContact('');   
        setContactType(null);
    }

    return (
        <div className={`page ${theme}`}>
            <div className='container'>
                <h3>Клиенты:</h3>
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
                    <b>Количество клиентов:</b> {total}
                </Card>
                <Button 
                    type='primary' 
                    style={{ width: '100%', padding: '10px', backgroundColor: 'var(--accent-blue)',
                        fontSize: '16px', height: '40px' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusOutlined />
                    Добавить клиента
                </Button>
                <Collapse ghost className={`collapse ${theme}`} items={
                    [
                        {
                            key: '1',
                            label: <Typography className={`heading-label ${theme}`}>Фильтры:</Typography>,
                            children: <ClientFilterForm 
                                changeContact={setClientContactFilter}
                                changeContactType={(value: ContactType) => setContactTypeFilter(value)}
                                changeDescription={setClientDescriptionFilter}
                                changeName={setClientNameFilter}
                                changeTag={(value: TagType) => setClientTagFilter(value)}
                            />,
                        },
                    ]   
                } />
                <Table
                    bordered
                    className={`table-${theme}`}
                    columns={columns}
                    key={clients.length}
                    scroll={{ x: 800 }}
                    style={{ width: '100%', borderRadius: '10px' }}
                    dataSource={clients.map((client: ClientWithContacts) => ({
                        key: client.client.id,
                        id: client.client.id,
                        name: client.client.name,
                        description: client.client.description,
                        tag: client.client.tag,
                        contacts: client.contacts,
                        hasDeal: client.client.hasDeal,
                    }))}
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
                            console.log(record)
                            navigate(`/clients/${record.id}`);
                        },
                    })}
                />
                <Modal
                    className={`modal-${theme}`}
                    footer={null}
                    open={isModalOpen}
                    title={<Typography className={`modal-title`}>Создание клиента</Typography>}
                    onCancel={refreshForm}
                    onClose={refreshForm}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                        <div style={{ width: '100%' }}>
                            <Typography className={`input-label`}>Имя клиента</Typography>
                            <Input
                                placeholder='Имя Клиента'
                            type='text'
                            value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                            />
                        </div>
                        <div style={{ width: '100%' }}>
                            <Typography className={`input-label`}>Описание</Typography>
                            <Input
                                placeholder='Описание'
                                type='text'
                                value={clientDescription}
                                onChange={(e) => setClientDescription(e.target.value)}
                            />
                        </div>
                        <div style={{ width: '100%' }}>
                            <Typography className={`input-label`}>Тег</Typography>
                            <Select
                                allowClear
                                placeholder='Тег'
                                popupClassName={`select-${theme}`}
                                style={{ width: '100%' }}
                                value={clientTag}
                                options={Object.values(TagType).map((tag) => ({
                                    value: tag,
                                    label: TagType[tag],
                                }))}
                                onChange={(value) => {
                                    setClientTag(value);
                                }}
                            />
                        </div>
                        <div style={{ width: '100%' }}>
                            <Typography className={`input-label`}>Контакт</Typography>
                            <Input
                                placeholder='Контакт'
                                style={{ color: 'inherit' }}
                                type='text'
                                value={clientContact}
                                prefix={
                                    <span style={{ color: 'inherit' }}>
                                        {contactType === ContactType.TELEGRAM ? '@' : '+7'}
                                    </span>
                                }
                                onChange={(e) => setClientContact(e.target.value)}
                            />
                        </div>
                        <div style={{ width: '100%' }}>
                            <Typography className={`input-label`}>Тип контакта</Typography>
                            <Select
                                allowClear
                                placeholder='Тип контакта'
                                popupClassName={`select-${theme}`}
                                style={{ width: '100%' }}
                                value={contactType}
                                options={Object.values(ContactType).map((tag) => ({
                                    value: tag,
                                    label: ContactType[tag],
                                }))}
                                onChange={(value) => {
                                    setContactType(value);
                                }}
                            />
                        </div>
                        <Button 
                            type='primary' 
                            style={{ marginBottom: '10px', width: '100%', padding: '10px', backgroundColor: 'var(--accent-blue)',
                            fontSize: '16px', height: '40px' }}
                            onClick={() => {
                                handleCreateClient();
                            }}
                        >
                            Создать клиента
                        </Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default ClientsListPage;