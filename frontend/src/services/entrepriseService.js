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
        return response.data.data || response.data;
    } catch (error) {
        console.error('Error fetching enterprise stats:', error);
        throw error;
    }
};

export const traiterCandidature = async (candidatureId, data) => {
    try {
        const response = await api.put(`/entreprise/candidatures/${candidatureId}/traiter`, data);
        
        // Déclencher automatiquement les événements de mise à jour
        if (response.data.success) {
            console.log('Candidature traitée avec succès, déclenchement des événements');
            
            // Événement pour la notification
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('newNotification', {
                    detail: { type: 'candidature', status: data.status }
                }));
            }, 500);
            
            // Événement pour les stats
            if (response.data.stats) {
                window.dispatchEvent(new CustomEvent('statsUpdated', { 
                    detail: response.data.stats 
                }));
            }
            
            // Événement de candidature traitée
            window.dispatchEvent(new CustomEvent('candidatureTraitee', {
                detail: { candidatureId, status: data.status }
            }));
        }
        
        return response.data;
    } catch (error) {
        console.error('Error processing candidature:', error);
        throw error;
    }
};