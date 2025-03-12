import { Deal, Payment } from './shared/types/types';

const API_BASE_URL_CLIENTS = 'http://192.168.56.181:3000/api/clients';
const API_BASE_URL_DEALS = 'http://192.168.56.181:3000/api/deals';
const API_BASE_URL_USERS = 'http://192.168.56.181:3000/api/users';
const API_BASE_URL_ANALYTICS = 'http://192.168.56.181:3000/api/analytics';
const API_BASE_URL_NOTIFICATIONS =
    'http://192.168.56.181:3000/api/notifications';
const API_BASE_URL_INVOICES =
    'http://192.168.56.181:3000/api/payments';


const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

export const refreshTokens = async () => {
    const newResponse = await fetch(API_BASE_URL_USERS + '/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accessToken: getAccessToken(),
            refreshToken: getRefreshToken(),
        }),
    });

    const newResponseData = await newResponse.json();
    if (newResponseData.accessToken) {
        localStorage.setItem('accessToken', newResponseData.accessToken);
    }

    if (newResponseData.refreshToken) {
        localStorage.setItem('refreshToken', newResponseData.refreshToken);
    }

    return newResponseData.status;
};

export const createClient = async (clientData: any) => {
    try {
        const response = await fetch(API_BASE_URL_CLIENTS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify(clientData),
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            // Retry the request after refreshing tokens
            const response = await fetch(API_BASE_URL_CLIENTS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAccessToken()}`,
                },
                body: JSON.stringify(clientData),
            });
            return await response;
        }
        return response;
    } catch (error) {
        return error;
    }
};

export const getAllClients = async (
    page: number,
    size: number,
    name?: string,
    description?: string,
    tag?: string,
    contact?: string,
    contactType?: string,
) => {
    try {
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page.toString());
        if (size) queryParams.append('limit', size.toString());
        if (name) queryParams.append('name', name);
        if (description) queryParams.append('description', description);
        if (tag) queryParams.append('tag', tag);
        if (contact) queryParams.append('contact', contact);
        if (contactType) queryParams.append('contactType', contactType);

        const response = await fetch(
            `${API_BASE_URL_CLIENTS}?${queryParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            },
        );
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            const response = await fetch(
                `${API_BASE_URL_CLIENTS}?${queryParams.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                },
            );
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.log(error);
    }
};

export const getClientById = async (id: string) => {
    try {
        const response = await fetch(`${API_BASE_URL_CLIENTS}/${id}`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            // Retry the request after refreshing tokens
            const response = await fetch(`${API_BASE_URL_CLIENTS}/${id}`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            });
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.log(error);
    }
};

export const updateClient = async (id: string, clientData: any) => {
    try {
        const response = await fetch(`${API_BASE_URL_CLIENTS}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify(clientData),
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            const retryResponse = await fetch(`${API_BASE_URL_CLIENTS}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAccessToken()}`,
                },
                body: JSON.stringify(clientData),
            });
            return await retryResponse.json();
        }
        return responseData;
    } catch (error) {
        console.error('Error updating client:', error);
        throw error;
    }
};

export const deleteClient = async (id: string) => {
    try {
        const response = await fetch(`${API_BASE_URL_CLIENTS}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            // Retry the request after refreshing tokens
            const response = await fetch(`${API_BASE_URL_CLIENTS}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            });
            return response.status;
        }
        return response.status;
    } catch (error) {
        console.log(error);
    }
};

export const createDeal = async (dealData: Deal) => {
    try {
        const response = await fetch(API_BASE_URL_DEALS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify(dealData),
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            // Retry the request after refreshing tokens
            const response = await fetch(API_BASE_URL_DEALS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAccessToken()}`,
                },
                body: JSON.stringify(dealData),
            });
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.log(error);
    }
};

export const getAllDeals = async (
    page: number,
    size: number,
    title?: string,
    clientId?: string,
    income?: string,
    currency?: string,
    status?: string,
) => {
    try {
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page.toString());
        if (size) queryParams.append('limit', size.toString());
        if (title) queryParams.append('title', title);
        if (clientId) queryParams.append('clientId', clientId);
        if (income) queryParams.append('income', income);
        if (currency) queryParams.append('currency', currency);
        if (status) queryParams.append('status', status);

        const response = await fetch(
            API_BASE_URL_DEALS + `?${queryParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            },
        );
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            const response = await fetch(
                API_BASE_URL_DEALS + `?${queryParams.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                },
            );
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.log(error);
    }
};

export const getMonthlyRevenue = async () => {
    try {
        const response = await fetch(
            API_BASE_URL_ANALYTICS + '/monthly-revenue',
            {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            },
        );
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            // Retry the request after refreshing tokens
            const response = await fetch(
                API_BASE_URL_ANALYTICS + '/monthly-revenue',
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                },
            );
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.log(error);
    }
};

export const getClientCount = async () => {
    try {
        const response = await fetch(API_BASE_URL_ANALYTICS + '/client-count', {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            // Retry the request after refreshing tokens
            const response = await fetch(
                API_BASE_URL_ANALYTICS + '/client-count',
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                },
            );
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.log(error);
    }
};

export const getClosedDeals = async () => {
    try {
        const response = await fetch(API_BASE_URL_ANALYTICS + '/deals/closed', {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            // Retry the request after refreshing tokens
            const response = await fetch(
                API_BASE_URL_ANALYTICS + '/deals/closed',
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                },
            );
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.log(error);
    }
};

export const getAverageCheck = async () => {
    try {
        const response = await fetch(
            API_BASE_URL_ANALYTICS + '/check/average',
            {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            },
        );
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            // Retry the request after refreshing tokens
            const response = await fetch(
                API_BASE_URL_ANALYTICS + '/check/average',
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                },
            );
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.log(error);
    }
};

export const getTotalDebts = async () => {
    try {
        const response = await fetch(API_BASE_URL_ANALYTICS + '/debts', {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            // Retry the request after refreshing tokens
            const response = await fetch(API_BASE_URL_ANALYTICS + '/debts', {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            });
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.log(error);
    }
};

export const getReturningClients = async () => {
    try {
        const response = await fetch(
            API_BASE_URL_ANALYTICS + '/clients/returning',
            {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            },
        );
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            // Retry the request after refreshing tokens
            const response = await fetch(
                API_BASE_URL_ANALYTICS + '/clients/returning',
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                },
            );
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.log(error);
    }
};

export const getDealsByClientId = async (clientId: string) => {
    try {
        const response = await fetch(
            `${API_BASE_URL_DEALS}/client/${clientId}`,
            {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            },
        );
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            const response = await fetch(
                `${API_BASE_URL_DEALS}/client/${clientId}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                },
            );
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.log(error);
    }
};

export const getDealById = async (id: string) => {
    try {
        const response = await fetch(`${API_BASE_URL_DEALS}/${id}`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            // Retry the request after refreshing tokens
            const response = await fetch(`${API_BASE_URL_DEALS}/${id}`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            });
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.log(error);
    }
};

export const updateDealClient = async (
    dealId: string,
    clientId: string,
): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL_DEALS}/${dealId}/client`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientId }),
        });

        if (!response.ok) {
            throw new Error('Failed to update deal client');
        }
    } catch (error) {
        console.error('Error updating deal client:', error);
        throw error;
    }
};

export const updateDeal = async (
    dealId: string,
    dealData: Partial<Deal>,
): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL_DEALS}/${dealId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify(dealData),
        });

        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            // Retry the request after refreshing tokens
            const response = await fetch(`${API_BASE_URL_DEALS}/${dealId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAccessToken()}`,
                },
                body: JSON.stringify(dealData),
            });
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.error('Error updating deal:', error);
        throw error;
    }
};

export const deleteDeal = async (dealId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL_DEALS}/${dealId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete deal');
        }
    } catch (error) {
        console.error('Error deleting deal:', error);
        throw error;
    }
};

export const addReminder = async (reminderData: Partial<Notification>) => {
    try {
        const response = await fetch(`${API_BASE_URL_NOTIFICATIONS}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify(reminderData),
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            const response = await fetch(`${API_BASE_URL_NOTIFICATIONS}/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
                body: JSON.stringify(reminderData),
            });
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.error('Error adding reminder:', error);
        throw error;
    }
};

export const getReminders = async (dateFrom?: string, dateTo?: string) => {
    try {
        const queryParams = new URLSearchParams();
        if (dateFrom) queryParams.append('dateFrom', dateFrom);
        if (dateTo) queryParams.append('dateTo', dateTo);

        const response = await fetch(
            `${API_BASE_URL_NOTIFICATIONS}/?${queryParams}`,
            {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            },
        );
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            const response = await fetch(
                `${API_BASE_URL_NOTIFICATIONS}/?${queryParams}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                },
            );
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.error('Error getting reminders:', error);
        throw error;
    }
};

export const createInvoice = async (dealId: string) => {
    try {
        const response = await fetch(`${API_BASE_URL_INVOICES}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            const response = await fetch(`${API_BASE_URL_INVOICES}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            });
            return await response.json();
        }
        return responseData;
    } catch (error) {
        console.error('Error creating invoice:', error);
        throw error;
    }
};

export const createPayment = async (paymentData: Partial<Payment>) => {
    try {
        const response = await fetch(`${API_BASE_URL_INVOICES}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify(paymentData),
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            const retryResponse = await fetch(`${API_BASE_URL_INVOICES}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAccessToken()}`,
                },
                body: JSON.stringify(paymentData),
            });
            return await retryResponse.json();
        }
        return responseData;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
};

export const getDealDynamics = async (dynamic: string) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('period', dynamic);

        const response = await fetch(`${API_BASE_URL_ANALYTICS}/deal-dynamics?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            const response = await fetch(`${API_BASE_URL_ANALYTICS}/deal-dynamics?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            });
            return await response.json();
        }
        return responseData.dealDynamics;
    } catch (error) {
        console.error('Error fetching deal dynamics:', error);
        throw error;
    }
};

export const getRevenueAnalytics = async (period: string    ) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('period', period);

        const response = await fetch(API_BASE_URL_ANALYTICS + '/revenue-analytics?' + queryParams.toString(), {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            const response = await fetch(API_BASE_URL_ANALYTICS + '/revenue-analytics?' + queryParams.toString(), {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            });
            return await response.json();
        }
        return responseData.revenueAnalytics;
    } catch (error) {
        console.error('Error fetching revenue analytics:', error);
        throw error;
    }
};

export const getSalesFunnelData = async () => {
    try {
        const response = await fetch(API_BASE_URL_ANALYTICS + '/sales-funnel', {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            const response = await fetch(API_BASE_URL_ANALYTICS + '/sales-funnel', {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            });
            return await response.json();
        }
        return responseData.salesFunnel;
    } catch (error) {
        console.error('Error fetching sales funnel data:', error);
        throw error;
    }
};

export const getClientReturnRate = async (period: string) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('period', period);

        const response = await fetch(API_BASE_URL_ANALYTICS + '/client-return-rate?' + queryParams.toString(), {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });
        const responseData = await response.json();
        if (
            response.status === 401 ||
            responseData.error === 'Отсутствует токен авторизации'
        ) {
            await refreshTokens();
            const response = await fetch(API_BASE_URL_ANALYTICS + '/client-return-rate?' + queryParams.toString(), {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            });
            return await response.json();
        }
        return responseData.clientReturnRate;
    } catch (error) {
        console.error('Error fetching client return rate:', error);
        throw error;
    }
};