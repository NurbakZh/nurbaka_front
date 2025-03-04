import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Input, Modal, Popconfirm, Select, Table, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { createClient, deleteClient, getAllClients } from '../../api';
import { useThemeStore } from '../../shared/stores/theme';
import { Client, ClientWithContacts, Contact, ContactColor, ContactType, TagColor, TagType } from '../../shared/types/types';
import ClientFilterForm from './ClientFilterForm';
import './ClientsListPage.scss';

const ClientsListPage: React.FC = () => {
    const theme = useThemeStore((x) => x.theme);
    const [clients, setClients] = useState<ClientWithContacts[]>([]);
    const [total, setTotal] = useState(0);  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contactType, setContactType] = useState<ContactType | null>(null);
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
        await createClient({
            name: clientName,
            description: clientDescription,
            tag: Object.keys(TagType).filter(key => TagType[key] === clientTag)[0],
            contacts: [{ contact: clientContact, contactType: Object.keys(ContactType).filter(key => ContactType[key] === contactType)[0] }],
        });
        fetchClients();
        refreshForm();
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
            render: (client: Client) => {
                console.log(client)
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
                    >Удалить</Button>
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
        <div className={`page ${theme}`} style={{ padding: '20px' }}>
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
                            type='text'
                            value={clientContact}
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
                            setIsModalOpen(false);
                        }}
                    >
                        Создать клиента
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default ClientsListPage;