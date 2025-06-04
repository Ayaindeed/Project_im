import api from './api';

// Service pour gérer les notifications étudiants
export const notificationService = {
    // Marquer une notification comme lue
    markAsRead: async (notificationId) => {
        try {
            const response = await api.put(`/notifications/${notificationId}/read`);
            return response.data;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    },

    // Récupérer toutes les notifications d'un étudiant
    getNotifications: async () => {
        try {
            const response = await api.get('/notifications');
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    // Compter les notifications non lues
    getUnreadCount: async () => {
        try {
            const response = await api.get('/notifications/unread-count');
            return response.data;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return { count: 0 };
        }
    },

    // Marquer toutes les notifications comme lues
    markAllAsRead: async () => {
        try {
            const response = await api.put('/notifications/read-all');
            return response.data;
        } catch (error) {
            console.error('Error marking all as read:', error);
            throw error;
        }
    },

    // Supprimer une notification
    deleteNotification: async (notificationId) => {
        try {
            const response = await api.delete(`/notifications/${notificationId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    },

    // Créer une notification locale (pour affichage immédiat)
    createLocalNotification: (title, message, type = 'info') => {
        // Créer une notification du navigateur si l'utilisateur a donné la permission
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        }

        // Émettre un événement pour l'affichage dans l'interface
        window.dispatchEvent(new CustomEvent('newNotification', {
            detail: { title, message, type, timestamp: new Date() }
        }));
    },    // Demander la permission pour les notifications du navigateur
    requestPermission: async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    },    // Forcer la synchronisation des notifications
    forceSync: () => {
        console.log('Force sync notifications');
        window.dispatchEvent(new CustomEvent('forceNotificationSync'));
    },

    // Fonction de test pour vérifier la synchronisation
    testSync: () => {
        console.log('Test de synchronisation des notifications');
        // Créer une notification de test
        window.dispatchEvent(new CustomEvent('newNotification', {
            detail: { 
                title: 'Test de synchronisation', 
                message: 'Cette notification teste la synchronisation en temps réel',
                type: 'info',
                timestamp: new Date() 
            }
        }));
    }
};

export default notificationService;
