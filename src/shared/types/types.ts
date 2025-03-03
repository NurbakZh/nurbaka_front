export interface Client {
    id: string;
    userId: string;
    name: string;
    description: string;
    tag: TagType;
    createdAt: Date;
}

export interface Contact {
    id: string;
    clientId: string;
    type: ContactType;
    contact: string;
}

export interface ClientWithContacts {
    client: Client;
    contacts: Contact[];
}

export enum ContactType {
    EMAIL = 'EMAIL',
    PHONE = 'PHONE',
    VK = 'VK',
    TELEGRAM = 'TELEGRAM',
    WHATSAPP = 'WHATSAPP',
    SKYPE = 'SKYPE',
    OTHER = 'OTHER',
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
