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
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
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
            <h1>Espace Administration</h1>

            <section className="overview-stats">
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Utilisateurs</h3>
                        <p>{users.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Stages</h3>
                        <p>{stageStats.disponible + stageStats.enCours + stageStats.termine}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Candidatures</h3>
                        <p>{stageStats.totalCandidatures}</p>
                    </div>
                </div>
            </section>            <section className="user-management">
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="stage-stats">
                <h2>Statistiques des stages</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Stages en cours</h3>
                        <p>{stageStats.enCours || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Stages disponibles</h3>
                        <p>{stageStats.disponible || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Stages terminés</h3>
                        <p>{stageStats.termine || 0}</p>
                    </div>
                </div>
            </section>

            <section className="candidature-stats">
                <h2>Statistiques des candidatures</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>En attente</h3>
                        <p>{stageStats.candidaturesParStatut.en_attente || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Acceptées</h3>
                        <p>{stageStats.candidaturesParStatut.accepte || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Refusées</h3>
                        <p>{stageStats.candidaturesParStatut.refuse || 0}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;