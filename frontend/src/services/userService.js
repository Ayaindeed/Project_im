import api from './api';

export const getUserStats = async () => {
    try {
        const response = await api.get('/admin/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
};

export const getStageStats = async () => {
    try {
        const response = await api.get('/admin/stages/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching stage stats:', error);
        throw error;
    }
};

export const toggleUserStatus = async (userId) => {
    try {
        const response = await api.put(`/admin/users/${userId}/toggle`);
        return response.data;
    } catch (error) {
        console.error('Error toggling user status:', error);
        throw error;
    }
};

export const getUserDetails = async (userId) => {
    try {
        const response = await api.get(`/admin/users/${userId}/details`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};