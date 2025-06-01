import api from './api';

export const getEntrepriseStages = async () => {
    try {
        const response = await api.get('/entreprise/stages');
        return response.data;
    } catch (error) {
        console.error('Error fetching enterprise stages:', error);
        throw error;
    }
};

export const getEntrepriseCandidatures = async () => {
    try {
        const response = await api.get('/entreprise/candidatures');
        return response.data;
    } catch (error) {
        console.error('Error fetching candidatures:', error);
        throw error;
    }
};

export const getEntrepriseProfile = async () => {
    const response = await api.get('/entreprise/profile');
    return response.data;
};

export const updateEntrepriseProfile = async (profileData) => {
    const response = await api.put('/entreprise/profile', profileData);
    return response.data;
};

export const getEntrepriseStats = async () => {
    try {
        const response = await api.get('/entreprise/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching enterprise stats:', error);
        throw error;
    }
};