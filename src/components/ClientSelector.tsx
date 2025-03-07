import { Button, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { getAllClients } from '../api';
import { Client } from '../shared/types/types';

interface ClientSelectorProps {
    currentClientId: string;
    onClientSelect: (clientId: string) => void;
    onCancel: () => void;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({
    currentClientId,
    onClientSelect,
    onCancel,
}) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<string>(currentClientId);

    useEffect(() => {
        const fetchClients = async () => {
            const data = await getAllClients(1, 1000);
            setClients(data.data);
        };
        fetchClients();
    }, []);

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Select
                style={{ width: '100%' }}
                value={selectedClient}
                options={clients.map(client => ({
                    value: client.id,
                    label: client.name
                }))}
                onChange={setSelectedClient}
            />
            <Space>
                <Button type="primary" onClick={() => onClientSelect(selectedClient)}>
                    Сохранить
                </Button>
                <Button onClick={onCancel}>
                    Отмена
                </Button>
            </Space>
        </Space>
    );
};

export default ClientSelector; 