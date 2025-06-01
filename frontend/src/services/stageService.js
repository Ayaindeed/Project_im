import api from './api';

export const getAllStages = async () => {
    const response = await api.get('/stage');
    return response.data;
};

export const getEntrepriseStages = async () => {
    try {
        console.log('Calling API: /entreprise/stages');
        const response = await api.get('/entreprise/stages');
        console.log('Enterprise stages API response:', response);
        console.log('Response data:', response.data);
        console.log('Data length:', response.data?.length);
        
        if (response.data && response.data.length > 0) {
            console.log('First stage:', response.data[0]);
            console.log('First stage candidatures:', response.data[0].candidatures);
        }
        
        // Return the data directly without nesting it further
        return response.data;
    } catch (error) {
        console.error('Error fetching enterprise stages:', error);
        console.error('Error details:', error.response?.data);
        throw error;
    }
};

export const createStage = async (stageData) => {
    try {
        console.log('Creating stage with data:', stageData);
        const response = await api.post('/entreprise/stages', stageData);
        return response.data;
    } catch (error) {
        console.error('Error creating stage:', error);
        throw error;
    }
};

export const postulerStage = async (formData) => {
    // Configure axios to handle FormData
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };
    const response = await api.post(`/stage/${formData.get('stageId')}/postuler`, formData, config);
    return response.data;
};

export const getStageStats = async () => {
    const response = await api.get('/admin/stages/stats');
    return response.data;
};

export const getCandidatures = async () => {
    try {
        const response = await api.get('/entreprise/candidatures');
        return response.data;
    } catch (error) {
        console.error('Error fetching candidatures:', error);
        throw error;
    }
};

export const traiterCandidature = async (candidatureId, data) => {
    try {
        const response = await api.put(`/entreprise/candidatures/${candidatureId}/traiter`, data);
        return response.data;
    } catch (error) {
        console.error('Error processing candidature:', error);
        throw error;
    }
};