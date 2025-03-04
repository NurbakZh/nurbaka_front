export interface Client {
    id: string;
    userId: string;
    name: string;
    description: string;
    tag: TagType;
    hasDeal: boolean;
    createdAt: Date;
}

export interface Contact {
    id: string;
    clientId: string;
    contactType: ContactType;
    contact: string;
}

export interface ClientWithContacts {
    client: Client;
    contacts: Contact[];
}

export enum ContactType {
    EMAIL = 'Почта',
    PHONE = 'Телефон',
    VK = 'VK',
    TELEGRAM = 'Телеграм',
    WHATSAPP = 'WhatsApp',
    INSTAGRAM = 'Instagram',
    OTHER = 'Другой',
}

export enum ContactColor {
    EMAIL = '#657786',
    PHONE = '#19a7a4',
    VK = 'blue',
    TELEGRAM = '#229ED9',
    WHATSAPP = '#25D366',
    INSTAGRAM = '#833AB4',
    OTHER = 'gray',
}

export enum TagType {
    BASIC = 'Базовый',
    PREMIUM = 'Премиум',
    VIP = 'VIP',
    PROBLEMATIC = 'Проблемный',
}

export enum TagColor {
    BASIC = 'blue',
    PREMIUM = 'green',
    VIP = 'yellow',
    PROBLEMATIC = 'red',
}

export enum DealStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    SUSPENDED = 'SUSPENDED',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

export interface Deal {
    id?: string;
    userId?: string;
    clientId?: string;
    clientName?: string;
    title?: string;
    notes?: string | null;
    status?: DealStatus;
    createdAt?: Date;
    income?: string;
    currency?: string;
    closedAt?: Date | null;
}
