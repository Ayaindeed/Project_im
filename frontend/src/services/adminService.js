import api from './api';

// Service pour récupérer tous les stages pour l'admin
export const getAllStagesForAdmin = async () => {
    try {
        const response = await api.get('/admin/stages');
        return response.data;
    } catch (error) {
        console.error('Error fetching all stages for admin:', error);
        throw error;
    }
};

// Service pour récupérer toutes les candidatures pour l'admin
export const getAllCandidaturesForAdmin = async () => {
    try {
        const response = await api.get('/admin/candidatures');
        return response.data;
    } catch (error) {
        console.error('Error fetching all candidatures for admin:', error);
        throw error;
    }
};

// Service pour mettre à jour le statut d'un stage (admin)
export const updateStageStatusAdmin = async (stageId, status) => {
    try {
        const response = await api.put(`/admin/stages/${stageId}/status`, { status });
        
        // Déclencher l'événement de mise à jour des stats
        window.dispatchEvent(new CustomEvent('statsUpdated', {
            detail: { type: 'stage_status_updated', stageId, status }
        }));
        
        return response.data;
    } catch (error) {
        console.error('Error updating stage status:', error);
        throw error;
    }
};

// Service pour récupérer les statistiques détaillées
export const getDetailedStats = async () => {
    try {
        const response = await api.get('/admin/stages/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching detailed stats:', error);
        throw error;
    }
};

// Service pour les notifications admin
export const dispatchAdminNotification = (type, data) => {
    const notificationEvent = new CustomEvent('adminNotification', {
        detail: { type, data, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(notificationEvent);
};

// Service pour synchroniser les données entre les pages admin
export const syncAdminData = () => {
    const syncEvent = new CustomEvent('adminDataSync', {
        detail: { timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(syncEvent);
};

export default {
    getAllStagesForAdmin,
    getAllCandidaturesForAdmin,
    updateStageStatusAdmin,
    getDetailedStats,
    dispatchAdminNotification,
    syncAdminData
};
