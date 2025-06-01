import api from './api';

export const traiterCandidature = async (candidatureId, data) => {
    try {
        const response = await api.put(`/entreprise/candidatures/${candidatureId}/traiter`, data);
        return response.data;
    } catch (error) {
        console.error('Error processing application:', error);
        throw error;
    }
};

export const getCandidatures = async () => {
    try {
        const response = await api.get('/entreprise/candidatures');
        return response.data;
    } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
    }
};

export const getEtudiantCandidatures = async () => {
    const response = await api.get('/etudiant/candidatures');
    return response.data;
};

export const updateCandidature = async (id, data) => {
    const response = await api.put(`/candidature/${id}`, data);
    return response.data;
};

export const submitCandidature = async (stageId, formData) => {
    try {
        // Utilisation de FormData pour gérer les fichiers
        const response = await api.post(`/etudiant/stages/${stageId}/postuler`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting application:', error);
        throw error;
    }
};