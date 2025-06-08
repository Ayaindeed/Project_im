import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserStats, toggleUserStatus } from '../services/userService';
import { getStageStats } from '../services/stageService';
import AdminNotifications from '../components/AdminNotifications';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stageStats, setStageStats] = useState({
        disponible: 0,
        enCours: 0,
        termine: 0,
        totalCandidatures: 0,
        candidaturesParStatut: {
            en_attente: 0,
            accepte: 0,
            refuse: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Récupérer les informations de l'admin connecté
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchData();
        
        // Écouter les événements de candidature traitée pour mettre à jour les stats
        const handleCandidatureUpdate = () => {
            console.log('Admin: Candidature traitée - mise à jour des stats');
            setTimeout(() => {
                fetchData();
            }, 1000);
        };        // Écouter les événements de mise à jour des stats
        const handleStatsUpdate = () => {
            console.log('Admin: Stats mises à jour');
            fetchData();
        };

        // Écouter les événements de synchronisation admin
        const handleAdminSync = () => {
            console.log('Admin: Synchronisation des données admin');
            fetchData();
        };

        // Écouter les notifications admin
        const handleAdminNotification = (event) => {
            console.log('Admin: Notification reçue', event.detail);
            fetchData();
        };

        window.addEventListener('candidatureTraitee', handleCandidatureUpdate);
        window.addEventListener('statsUpdated', handleStatsUpdate);
        window.addEventListener('adminDataSync', handleAdminSync);
        window.addEventListener('adminNotification', handleAdminNotification);

        return () => {
            window.removeEventListener('candidatureTraitee', handleCandidatureUpdate);
            window.removeEventListener('statsUpdated', handleStatsUpdate);
            window.removeEventListener('adminDataSync', handleAdminSync);
            window.removeEventListener('adminNotification', handleAdminNotification);
        };
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersData, stagesData] = await Promise.all([
                getUserStats(),
                getStageStats()
            ]);
            setUsers(usersData);
            setStageStats(stagesData);
        } catch (err) {
            setError('Erreur lors du chargement des données');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            await toggleUserStatus(userId);
            fetchData();
        } catch (err) {
            setError('Erreur lors de la modification du statut');
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;
    if (error) return <div className="error-message">{error}</div>;    return (
        <div className="admin-dashboard">
            <AdminNotifications />
            
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="header-text">
                        <h1>Espace Administration</h1>
                        <p className="welcome-message">
                            Bienvenue, {user.prenom} {user.nom} !
                        </p>
                        <p className="welcome-text">
                            Gérez et supervisez l'ensemble du processus de stage.
                        </p>
                    </div>
                    <div className="header-stats">
                        <div className="quick-stat">
                            <span className="stat-number">{users.length}</span>
                            <span className="stat-label">Utilisateurs</span>
                        </div>
                        <div className="quick-stat">
                            <span className="stat-number">{stageStats.total || 0}</span>
                            <span className="stat-label">Stages</span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="overview-stats">
                <div className="stats-grid">
                    <div className="stat-card users-card">
                        <div className="card-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="card-content">
                            <h3>Total Utilisateurs</h3>
                            <p className="stat-number">{users.length}</p>
                            <span className="stat-change">Tous les comptes</span>
                        </div>
                    </div>
                    
                    <Link to="/admin-stages" className="stat-card clickable stages-card">
                        <div className="card-icon">
                            <i className="fas fa-briefcase"></i>
                        </div>
                        <div className="card-content">
                            <h3>Total Stages</h3>
                            <p className="stat-number">{stageStats.total || 0}</p>
                            <span className="stat-change">Toutes offres</span>
                        </div>
                        <div className="card-arrow">
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                    
                    <Link to="/admin-candidatures" className="stat-card clickable candidatures-card">
                        <div className="card-icon">
                            <i className="fas fa-file-alt"></i>
                        </div>
                        <div className="card-content">
                            <h3>Total Candidatures</h3>
                            <p className="stat-number">{stageStats.totalCandidatures || 0}</p>
                            <span className="stat-change">Toutes candidatures</span>
                        </div>
                        <div className="card-arrow">
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                </div>
                
                {/* Statistiques détaillées des candidatures */}
                <div className="candidature-stats">
                    <h3>Candidatures par statut</h3>
                    <div className="detailed-stats-grid">
                        <div className="detailed-stat-card pending">
                            <div className="stat-header">
                                <div className="stat-icon pending-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>En attente</h4>
                                    <p className="stat-value">{stageStats.candidaturesParStatut?.en_attente || 0}</p>
                                </div>
                            </div>
                            <div className="stat-footer">
                                <span className="stat-description">Candidatures en cours de traitement</span>
                            </div>
                        </div>
                        
                        <div className="detailed-stat-card accepted">
                            <div className="stat-header">
                                <div className="stat-icon accepted-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Acceptées</h4>
                                    <p className="stat-value">{stageStats.candidaturesParStatut?.accepté || 0}</p>
                                </div>
                            </div>
                            <div className="stat-footer">
                                <span className="stat-description">Candidatures validées</span>
                            </div>
                        </div>
                        
                        <div className="detailed-stat-card rejected">
                            <div className="stat-header">
                                <div className="stat-icon rejected-icon">
                                    <i className="fas fa-times-circle"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Refusées</h4>
                                    <p className="stat-value">{stageStats.candidaturesParStatut?.refusé || 0}</p>
                                </div>
                            </div>
                            <div className="stat-footer">
                                <span className="stat-description">Candidatures rejetées</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="user-management">
                <div className="section-header">
                    <div className="section-title">
                        <h2>Gestion des comptes utilisateurs</h2>
                        <p className="section-subtitle">Gérez les utilisateurs et leurs permissions</p>
                    </div>
                    <div className="section-header-actions">
                        <Link to="/admin-users" className="view-all-btn">
                            <i className="fas fa-external-link-alt"></i>
                            Voir tous les utilisateurs
                        </Link>
                    </div>
                </div>
                
                <div className="users-table-container">
                    <div className="table-wrapper">
                        <table className="enhanced-table">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="th-content">
                                            <i className="fas fa-user"></i>
                                            Utilisateur
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <i className="fas fa-envelope"></i>
                                            Email
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <i className="fas fa-tag"></i>
                                            Rôle
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <i className="fas fa-toggle-on"></i>
                                            Statut
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <i className="fas fa-cogs"></i>
                                            Actions
                                        </div>
                                    </th>
                                </tr>
                            </thead>                            <tbody>
                                {users.slice(0, 4).map(user => (
                                    <tr key={user.id} className="table-row">
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    {user.nom?.[0]}{user.prenom?.[0]}
                                                </div>
                                                <div className="user-details">
                                                    <span className="user-name">{user.nom} {user.prenom}</span>
                                                    <span className="user-id">ID: {user.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="user-email">{user.email}</span>
                                        </td>
                                        <td>
                                            <span className={`role-badge enhanced-badge role-${user.role}`}>
                                                <i className={`fas ${user.role === 'admin' ? 'fa-crown' : 
                                                    user.role === 'entreprise' ? 'fa-building' : 'fa-graduation-cap'}`}></i>
                                                {user.role === 'admin' ? 'Admin' : 
                                                user.role === 'entreprise' ? 'Entreprise' : 'Étudiant'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge enhanced-status ${user.actif ? 'active' : 'inactive'}`}>
                                                <div className="status-indicator"></div>
                                                {user.actif ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleToggleStatus(user.id)}
                                                className={`action-btn ${user.actif ? 'btn-danger' : 'btn-success'}`}
                                                title={user.actif ? 'Désactiver l\'utilisateur' : 'Activer l\'utilisateur'}
                                            >
                                                <i className={`fas ${user.actif ? 'fa-ban' : 'fa-check'}`}></i>
                                                {user.actif ? 'Désactiver' : 'Activer'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;