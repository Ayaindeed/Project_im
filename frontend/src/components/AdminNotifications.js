import React, { useState, useEffect } from 'react';
import './AdminNotifications.css';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Écouter tous les événements de synchronisation admin
        const handleAdminNotification = (event) => {
            const notification = {
                id: Date.now(),
                type: event.detail.type,
                message: getNotificationMessage(event.detail),
                timestamp: new Date(),
                data: event.detail.data
            };
            
            setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Garder seulement 5 notifications
            setVisible(true);
            
            // Auto-hide après 5 secondes
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== notification.id));
            }, 5000);
        };

        const handleCandidatureUpdate = (event) => {
            const notification = {
                id: Date.now(),
                type: 'candidature_update',
                message: 'Une candidature a été traitée',
                timestamp: new Date(),
                data: event.detail
            };
            
            setNotifications(prev => [notification, ...prev.slice(0, 4)]);
            setVisible(true);
            
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== notification.id));
            }, 5000);
        };

        const handleStatsUpdate = () => {
            const notification = {
                id: Date.now(),
                type: 'stats_update',
                message: 'Les statistiques ont été mises à jour',
                timestamp: new Date(),
                data: null
            };
            
            setNotifications(prev => [notification, ...prev.slice(0, 4)]);
            setVisible(true);
            
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== notification.id));
            }, 5000);
        };

        window.addEventListener('adminNotification', handleAdminNotification);
        window.addEventListener('candidatureTraitee', handleCandidatureUpdate);
        window.addEventListener('statsUpdated', handleStatsUpdate);

        return () => {
            window.removeEventListener('adminNotification', handleAdminNotification);
            window.removeEventListener('candidatureTraitee', handleCandidatureUpdate);
            window.removeEventListener('statsUpdated', handleStatsUpdate);
        };
    }, []);

    const getNotificationMessage = (detail) => {
        switch (detail.type) {
            case 'stage_status_updated':
                return `Le statut du stage a été mis à jour vers "${detail.status}"`;
            case 'candidature_processed':
                return `Une candidature a été ${detail.status}`;
            case 'user_status_changed':
                return `Le statut d'un utilisateur a été modifié`;
            case 'data_sync':
                return 'Synchronisation des données effectuée';
            default:
                return 'Notification admin';
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'candidature_update':
                return '📋';
            case 'stats_update':
                return '📊';
            case 'stage_status_updated':
                return '🏢';
            case 'user_status_changed':
                return '👤';
            case 'data_sync':
                return '🔄';
            default:
                return '🔔';
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div className={`admin-notifications ${visible ? 'visible' : ''}`}>
            {notifications.map(notification => (
                <div key={notification.id} className={`notification notification-${notification.type}`}>
                    <div className="notification-content">
                        <span className="notification-icon">
                            {getNotificationIcon(notification.type)}
                        </span>
                        <div className="notification-text">
                            <p className="notification-message">{notification.message}</p>
                            <span className="notification-time">
                                {notification.timestamp.toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminNotifications;
