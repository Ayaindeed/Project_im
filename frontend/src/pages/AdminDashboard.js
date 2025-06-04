import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserStats, toggleUserStatus } from '../services/userService';
import { getStageStats } from '../services/stageService';
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
    const [error, setError] = useState(null);    useEffect(() => {
        fetchData();
        
        // Écouter les événements de candidature traitée pour mettre à jour les stats
        const handleCandidatureUpdate = () => {
            console.log('Admin: Candidature traitée - mise à jour des stats');
            setTimeout(() => {
                fetchData();
            }, 1000);
        };

        // Écouter les événements de mise à jour des stats
        const handleStatsUpdate = () => {
            console.log('Admin: Stats mises à jour');
            fetchData();
        };

        window.addEventListener('candidatureTraitee', handleCandidatureUpdate);
        window.addEventListener('statsUpdated', handleStatsUpdate);

        return () => {
            window.removeEventListener('candidatureTraitee', handleCandidatureUpdate);
            window.removeEventListener('statsUpdated', handleStatsUpdate);
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
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-dashboard">
            <h1>Espace Administration</h1>            <section className="overview-stats">
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Utilisateurs</h3>
                        <p>{users.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Stages</h3>
                        <p>{stageStats.total || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Candidatures</h3>
                        <p>{stageStats.totalCandidatures || 0}</p>
                    </div>
                </div>
                
                {/* Statistiques détaillées des candidatures */}
                <div className="candidature-stats">
                    <h3>Candidatures par statut</h3>
                    <div className="stats-grid">
                        <div className="stat-card pending">
                            <h4>En attente</h4>
                            <p>{stageStats.candidaturesParStatut?.en_attente || 0}</p>
                        </div>
                        <div className="stat-card accepted">
                            <h4>Acceptées</h4>
                            <p>{stageStats.candidaturesParStatut?.accepté || 0}</p>
                        </div>
                        <div className="stat-card rejected">
                            <h4>Refusées</h4>
                            <p>{stageStats.candidaturesParStatut?.refusé || 0}</p>
                        </div>
                    </div>
                </div>
            </section><section className="user-management">
                <h2>Gestion des comptes utilisateurs</h2>
                <div className="section-header-actions">
                    <Link to="/admin-users" className="view-all-btn">Voir tous les utilisateurs</Link>
                </div>
                <div className="users-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Utilisateur</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.slice(0, 5).map(user => (
                                <tr key={user.id}>
                                    <td>{user.nom} {user.prenom}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge role-${user.role}`}>
                                            {user.role === 'admin' ? 'Admin' : 
                                            user.role === 'entreprise' ? 'Entreprise' : 'Étudiant'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.actif ? 'active' : 'inactive'}`}>
                                            {user.actif ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleStatus(user.id)}
                                            className={`btn ${user.actif ? 'btn-danger' : 'btn-success'}`}
                                        >
                                            {user.actif ? 'Désactiver' : 'Activer'}
                                        </button>
                                    </td>
                                </tr>
                            ))}                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;