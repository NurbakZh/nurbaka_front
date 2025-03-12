export interface Client {
    id?: string;
    userId?: string;
    name?: string;
    description: string;
    tag: TagType | string;
    hasDeal: boolean;
    createdAt?: Date;
}

export interface Contact {
    id?: string;
    clientId?: string;
    contactType?: ContactType | string;
    contact?: string;
}

export interface ClientWithContacts {
    client: Client;
    contacts: Contact[];
}

export enum ContactType {
    PHONE = 'Телефон',
    TELEGRAM = 'Телеграм',
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
    POTENTIAL = 'Потенциальный',
    NEW = 'Новый',
    VIP = 'VIP',
    REGULAR = 'Постоянный',
}

export enum TagColor {
    POTENTIAL = 'blue',
    NEW = 'green',
    VIP = 'yellow',
    REGULAR = 'purple',
}

export enum PaymentStatus {
    PAID = 'Оплачен',
    UNPAID = 'Не оплачен',
}

export interface Payment {
    userId?: string;
    clientId?: string;
    dealId?: string;
    originalAmount?: string;
    baseAmountRub?: string;
    baseAmountUsd?: string;
    paymentMethod?: string;
    paymentUrl?: string;
    status?: PaymentStatus | string;
    paidAmount?: null;
    createdAt?: Date;
    paidAt?: null;
}

export enum DealStatus {
    IN_PROGRESS = 'В процессе',
    SUSPENDED = 'Отложен',
    SUCCESS = 'Успех',
    FAILED = 'Неудача',
    WAITING_FOR_PAYMENT = 'Ожидает оплаты',
}

export interface Deal {
    id?: string;
    userId?: string;
    clientId?: string;
    clientName?: string;
    title?: string;
    notes?: string | null;
    status?: DealStatus | string;
    createdAt?: Date;
    income?: string;
    currency?: string;
    closedAt?: Date | null;
    plannedTill?: Date | null;
}

export interface Notification {
    id?: string;
    userId?: string;
    dealId?: string;
    clientId?: string;
    message?: string;
    reminderTime?: Date;
    clientName?: string;
    type?: NotificationType;
    status?: NotificationStatus;
    createdAt?: Date;
    title?: string;
    dealTitle?: string;
}

export enum NotificationType {
    REMINDER = 'reminder',
    PAYMENT = 'payment',
}

export enum NotificationStatus {
    ACTIVE = 'active',
    DONE = 'done',
    CANCELLED = 'cancelled',
}

export enum NotificationStatusRu {
    ACTIVE = 'Активно',
    DONE = 'Выполнено',
    CANCELLED = 'Отменено',
}

export enum NotificationTypeRu {
    REMINDER = 'Напоминание',
    PAYMENT = 'Платеж',
}
