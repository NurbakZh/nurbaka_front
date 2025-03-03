import { Deal } from './shared/types/types';

const API_BASE_URL_CLIENTS = 'http://localhost:3000/api/clients';
const API_BASE_URL_DEALS = 'http://localhost:3000/api/deals';
const API_BASE_URL_USERS = 'http://localhost:3000/api/users';
const API_BASE_URL_ANALYTICS = 'http://localhost:3000/api/analytics';

const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

export const refreshTokens = async () => {
    const newResponse = await fetch(API_BASE_URL_USERS + '/refresh', {
        method: 'POST',
        body: JSON.stringify({
            accessToken: getAccessToken(),
            refreshToken: getRefreshToken(),
        }),
    });
    const newResponseData = await newResponse.json();
    localStorage.setItem('accessToken', newResponseData.accessToken);
    localStorage.setItem('refreshToken', newResponseData.refreshToken);
    return newResponseData.status;
};

export const createClient = async (clientData: any) => {
    const response = await fetch(API_BASE_URL_CLIENTS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(clientData),
    });
    return response.json();
};

export const getAllClients = async (page: number, size: number) => {
    const response = await fetch(
        API_BASE_URL_CLIENTS + `?page=${page}&limit=${size}`,
        {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        },
    );
    return response.json();
};

export const getClientById = async (id: string) => {
    const response = await fetch(`${API_BASE_URL_CLIENTS}/${id}`, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`,
        },
    });
    return response.json();
};

export const updateClient = async (id: string, clientData: any) => {
    const response = await fetch(`${API_BASE_URL_CLIENTS}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(clientData),
    });
    return response.json();
};

export const deleteClient = async (id: string) => {
    const response = await fetch(`${API_BASE_URL_CLIENTS}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getAccessToken()}`,
        },
    });
    return response.status;
};

export const createDeal = async (dealData: Deal) => {
    const response = await fetch(API_BASE_URL_DEALS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(dealData),
    });
    return response.json();
};

export const getAllDeals = async (page: number, size: number) => {
    const response = await fetch(
        API_BASE_URL_DEALS + `?page=${page}&limit=${size}`,
        {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        },
    );
    return response.json();
};

export const getMonthlyRevenue = async () => {
    const response = await fetch(API_BASE_URL_ANALYTICS + '/monthly-revenue', {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`,
        },
    });
    return response.json();
};

export const getClientCount = async () => {
    const response = await fetch(API_BASE_URL_ANALYTICS + '/client-count', {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`,
        },
    });
    return response.json();
};

export const getClosedDeals = async () => {
    const response = await fetch(API_BASE_URL_ANALYTICS + '/deals/closed', {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`,
        },
    });
    return response.json();
};

export const getAverageCheck = async () => {
    const response = await fetch(API_BASE_URL_ANALYTICS + '/check/average', {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`,
        },
    });
    return response.json();
};

export const getTotalDebts = async () => {
    const response = await fetch(API_BASE_URL_ANALYTICS + '/debts', {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`,
        },
    });
    return response.json();
};

export const getReturningClients = async () => {
    const response = await fetch(
        API_BASE_URL_ANALYTICS + '/clients/returning',
        {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        },
    );
    return response.json();
};

// Add other API functions similarly...
