import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Badge, 
  Dropdown,
  DropdownToggle, 
  DropdownMenu, 
  DropdownItem,
  Button,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import { FaBell, FaCheck, FaTrash, FaTimes, FaCheckCircle, FaTimesCircle, FaClock, FaInfoCircle, FaDot } from 'react-icons/fa';
import { notificationService } from '../services/notificationService';
import mascotImage from '../assets/mascot.png';
import './NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  // Memoized filtered notifications for better performance and proper re-rendering
  const filteredNotifications = useMemo(() => {
    return showOnlyUnread ? notifications.filter(n => !n.lue) : notifications;
  }, [notifications, showOnlyUnread]);
  // Memoized toggle handler
  const handleToggleChange = useCallback((e) => {
    e.stopPropagation();
    setShowOnlyUnread(e.target.checked);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      // No fake notifications - show empty state
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async (forceUpdate = false) => {
    try {
      const data = await notificationService.getUnreadCount();
      const newCount = data.count || 0;
      
      console.log('Count loaded:', newCount, 'Previous:', unreadCount);
      
      // Si le nombre a augmenté ou si c'est un force update, déclencher l'animation
      if (newCount > unreadCount || forceUpdate) {
        // Animation du badge pour attirer l'attention
        const badge = document.querySelector('.notification-badge');
        if (badge && newCount > 0) {
          badge.classList.add('notification-pulse');
          setTimeout(() => {
            badge.classList.remove('notification-pulse');
          }, 1000);
        }
      }
      
      setUnreadCount(newCount);
    } catch (error) {
      console.error('Erreur lors du chargement du compteur:', error);
      // Ne pas changer le count en cas d'erreur pour éviter les resets intempestifs
    }
  };

  // Fonction de vérification immédiate
  const immediateCheck = useCallback(async () => {
    console.log('Vérification immédiate des notifications');
    await Promise.all([
      loadNotifications(),
      loadUnreadCount(true)
    ]);
  }, []);

  useEffect(() => {
    // Chargement initial immédiat
    immediateCheck();
    
    // Polling plus fréquent pour les nouvelles notifications (toutes les 3 secondes)
    const interval = setInterval(() => {
      loadUnreadCount();
      // Recharger aussi les notifications pour détecter les nouvelles
      if (!isOpen) {
        loadNotifications();
      }
    }, 3000);// Écouter les événements de nouvelles notifications
    const handleNewNotification = () => {
      console.log('Event: nouvelle notification détectée');
      immediateCheck();
    };    // Écouter les événements de candidature traitée
    const handleCandidatureUpdate = (event) => {
      console.log('Event: candidature traitée', event.detail);
      // Délai plus court et forcer le rechargement
      setTimeout(() => {
        immediateCheck();
      }, 500);
    };

    // Écouter les événements de mise à jour des stats (qui incluent souvent des nouvelles notifications)
    const handleStatsUpdate = () => {
      console.log('Event: stats mises à jour');
      setTimeout(() => {
        immediateCheck();
      }, 500);
    };

    // Écouter l'événement de synchronisation forcée
    const handleForceSync = () => {
      console.log('Event: synchronisation forcée');
      immediateCheck();
    };

    window.addEventListener('newNotification', handleNewNotification);
    window.addEventListener('candidatureTraitee', handleCandidatureUpdate);
    window.addEventListener('statsUpdated', handleStatsUpdate);
    window.addEventListener('forceNotificationSync', handleForceSync);

    return () => {
      clearInterval(interval);
      window.removeEventListener('newNotification', handleNewNotification);
      window.removeEventListener('candidatureTraitee', handleCandidatureUpdate);
      window.removeEventListener('statsUpdated', handleStatsUpdate);
      window.removeEventListener('forceNotificationSync', handleForceSync);
    };  }, [isOpen]);

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, lue: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(notif => ({ ...notif, lue: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage global:', error);
    }
  };
  const deleteNotification = async (notificationId) => {
    console.log('Tentative de suppression de la notification:', notificationId);
    try {
      await notificationService.deleteNotification(notificationId);
        // Mettre à jour la liste des notifications
      const notificationToDelete = notifications.find(n => n.id === notificationId);
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
      
      // Réduire le compteur si la notification n'était pas lue
      if (notificationToDelete && !notificationToDelete.lue) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      console.log('Notification supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      // En cas d'erreur du service, supprimer quand même localement pour la démonstration
      const notificationToDelete = notifications.find(n => n.id === notificationId);
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
      if (notificationToDelete && !notificationToDelete.lu) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const toggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      loadNotifications();
    }
  };
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'acceptee':
        return <FaCheckCircle style={{ color: '#28a745' }} />;
      case 'refusee':
        return <FaTimesCircle style={{ color: '#dc3545' }} />;
      case 'en_attente':
        return <FaClock style={{ color: '#ffc107' }} />;
      default:
        return <FaInfoCircle style={{ color: '#17a2b8' }} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'À l\'instant';
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays}j`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };  return (
    <Dropdown isOpen={isOpen} toggle={toggle} className="notification-dropdown">
      <DropdownToggle 
        tag="button" 
        className="notification-bell"
        caret={false}
      >
        <FaBell size={16} />
        {unreadCount > 0 && (
          <Badge className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </DropdownToggle>      <DropdownMenu right className="notification-menu">          <DropdownItem header className="notification-header d-flex justify-content-between align-items-center">
            <span>Notifications</span>            <div className="toggle-switch" onClick={(e) => e.stopPropagation()}>
              <span>Non lues</span>              <input 
                type="checkbox" 
                checked={showOnlyUnread}
                onChange={handleToggleChange}
              />
            </div>
          </DropdownItem><div className="notification-list" key={`notifications-${showOnlyUnread}`}>
          {loading ? (
            <DropdownItem disabled>
              <div className="text-center">Chargement...</div>
            </DropdownItem>          ) : (() => {
            if (filteredNotifications.length === 0) {
              return (
                <div className="no-notifications-empty-state">
                  <div className="empty-state-mascot">
                    <img src={mascotImage} alt="Aucune notification" className="mascot-image" />
                    <div className="sparkles">
                      <div className="sparkle sparkle-1">✨</div>
                      <div className="sparkle sparkle-2">✨</div>
                      <div className="sparkle sparkle-3">✨</div>
                    </div>
                  </div>                  <h4 className="empty-state-title">
                    {showOnlyUnread ? "Aucune notification non lue" : "Aucune notification"}
                  </h4>                  <p className="empty-state-subtitle">
                    {showOnlyUnread 
                      ? "Vous êtes à jour ! Les nouvelles notifications apparaîtront ici."
                      : "Vous n'avez pas encore de notifications. Les nouvelles notifications apparaîtront ici."
                    }
                  </p>
                </div>
              );
            }
            
            return filteredNotifications.slice(0, 10).map((notification) => (              <DropdownItem 
                key={notification.id} 
                className={`notification-item ${!notification.lue ? 'unread' : ''} notification-${notification.type}`}
                onClick={() => !notification.lue && markAsRead(notification.id)}
              >
                <div className="notification-content">
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-text">
                    <div className="notification-title">
                      {notification.titre}
                    </div>
                    <div className="notification-message">
                      {notification.message.length > 50 ? 
                        notification.message.substring(0, 50) + '...' : 
                        notification.message
                      }
                    </div>
                    <div className="notification-time">
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>
                  <div className="notification-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger notification-delete-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Suppression de la notification:', notification.id);
                        deleteNotification(notification.id);
                      }}
                      title="Supprimer la notification"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                </div>
              </DropdownItem>
            ));
          })()}
        </div>        {filteredNotifications.length > 10 && (
          <>
            <DropdownItem divider />
            <DropdownItem className="text-center">
              <small className="text-muted">
                {filteredNotifications.length - 10} autres notifications...
              </small>
            </DropdownItem>
          </>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default NotificationBell;
