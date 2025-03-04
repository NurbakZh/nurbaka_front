import { Input, Select, Typography } from 'antd';
import React from 'react';
import { useThemeStore } from '../../shared/stores/theme';
import { ContactType, TagType } from '../../shared/types/types';

interface ClientFilterFormProps {
    changeName: (name: string) => void;
    changeDescription: (description: string) => void;
    changeTag: (tag: string) => void;
    changeContact: (contact: string) => void;
    changeContactType: (contactType: string) => void;
}

const ClientFilterForm: React.FC<ClientFilterFormProps> = ({ changeName, changeDescription, changeTag, changeContact, changeContactType }) => {
    const theme = useThemeStore((state) => state.theme);    
    return (
        <div className={`filter-form ${theme}`} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '100%' }}> 
                <Typography className={`input-label ${theme}`}>Имя клиента</Typography>
                <Input placeholder='Имя Клиента' type='text' onChange={(e) => changeName(e.target.value)} />
            </div>
            <div style={{ width: '100%' }}>
                <Typography className={`input-label ${theme}`}>Описание</Typography>
                <Input placeholder='Описание' type='text' onChange={(e) => changeDescription(e.target.value)} />
            </div>
            <div style={{ width: '100%' }}>
                <Typography className={`input-label ${theme}`}>Тег</Typography>
                <Select
                    placeholder='Тег'
                    popupClassName={`select-${theme}`}
                    style={{ width: '100%' }}
                    options={[{ value: '', label: '' }, ...Object.values(TagType).map((tag) => ({
                        value: tag,
                        label: TagType[tag],
                    }))]}
                    onChange={(value) => changeTag(value)}
                />
            </div>
            <div style={{ width: '100%' }}>
                <Typography className={`input-label ${theme}`}>Контакт</Typography>
                <Input placeholder='Контакт' type='text' onChange={(e) => changeContact(e.target.value)} />
            </div>
            <div style={{ width: '100%' }}>
                <Typography className={`input-label ${theme}`}>Тип контакта</Typography>
                <Select
                    placeholder='Тип контакта'
                    popupClassName={`select-${theme}`}
                    style={{ width: '100%' }}
                    options={[{ value: '', label: '' }, ...Object.values(ContactType).map((type) => ({
                        value: type,
                        label: ContactType[type],
                    }))]}
                    onChange={(value) => changeContactType(value)}
                />
            </div>
        </div>
    );
};

export default ClientFilterForm;
