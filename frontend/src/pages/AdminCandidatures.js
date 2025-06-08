import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCandidaturesForAdmin } from '../services/adminService';
import AdminNotifications from '../components/AdminNotifications';
import '../styles/AdminPages.css';

const AdminCandidatures = () => {
    const [candidatures, setCandidatures] = useState([]);
    const [filteredCandidatures, setFilteredCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');    useEffect(() => {
        fetchCandidatures();
        
        // Écouter les événements de synchronisation
        const handleAdminSync = () => {
            console.log('AdminCandidatures: Synchronisation des données');
            fetchCandidatures();
        };

        const handleStatsUpdate = () => {
            console.log('AdminCandidatures: Stats mises à jour');
            fetchCandidatures();
        };

        const handleCandidatureUpdate = () => {
            console.log('AdminCandidatures: Candidature traitée');
            setTimeout(() => {
                fetchCandidatures();
            }, 1000);
        };

        window.addEventListener('adminDataSync', handleAdminSync);
        window.addEventListener('statsUpdated', handleStatsUpdate);
        window.addEventListener('candidatureTraitee', handleCandidatureUpdate);

        return () => {
            window.removeEventListener('adminDataSync', handleAdminSync);
            window.removeEventListener('statsUpdated', handleStatsUpdate);
            window.removeEventListener('candidatureTraitee', handleCandidatureUpdate);
        };
    }, []);

    useEffect(() => {
        filterCandidatures();
    }, [candidatures, searchTerm, statusFilter]);    const fetchCandidatures = async () => {
        try {
            setLoading(true);
            const data = await getAllCandidaturesForAdmin();
            setCandidatures(data);
        } catch (err) {
            setError('Erreur lors du chargement des candidatures');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterCandidatures = () => {
        let filtered = [...candidatures];

        if (searchTerm.trim()) {
            filtered = filtered.filter(candidature =>
                candidature.etudiant?.user?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidature.etudiant?.user?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidature.etudiant?.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidature.stage?.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidature.stage?.entreprise?.nom.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(candidature => candidature.status === statusFilter);
        }

        setFilteredCandidatures(filtered);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'en_attente': { class: 'status-pending', text: 'En attente', icon: '⏳' },
            'accepté': { class: 'status-accepted', text: 'Acceptée', icon: '✅' },
            'refusé': { class: 'status-rejected', text: 'Refusée', icon: '❌' }
        };
        return statusConfig[status] || { class: 'status-unknown', text: status, icon: '❓' };
    };

    const getFileUrl = (filePath) => {
        if (!filePath) return null;
        if (filePath.startsWith('/uploads/')) {
            return `http://localhost:3001${filePath}`;
        }
        return `http://localhost:3001/uploads/${filePath}`;
    };

    if (loading) return <div className="loading">Chargement...</div>;
    if (error) return <div className="error-message">{error}</div>;    return (
        <div className="admin-page">
            <AdminNotifications />
            <div className="page-header">
                <div className="header-content">
                    <h1>Gestion des Candidatures</h1>
                    <Link to="/admin-dashboard" className="back-btn">
                        ← Retour au tableau de bord
                    </Link>
                </div>
                <div className="page-stats">
                    <div className="stat-item">
                        <span className="stat-number">{candidatures.length}</span>
                        <span className="stat-label">Total candidatures</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{candidatures.filter(c => c.status === 'en_attente').length}</span>
                        <span className="stat-label">En attente</span>
                    </div>
                </div>
            </div>

            <div className="page-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Rechercher par étudiant, stage ou entreprise..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-container">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="en_attente">En attente</option>
                        <option value="accepté">Acceptée</option>
                        <option value="refusé">Refusée</option>
                    </select>
                </div>
            </div>

            <div className="content-section">
                {filteredCandidatures.length === 0 ? (
                    <div className="no-results">
                        {searchTerm || statusFilter ? 
                            'Aucune candidature ne correspond aux critères de recherche' :
                            'Aucune candidature disponible'
                        }
                    </div>
                ) : (
                    <div className="candidatures-list">
                        {filteredCandidatures.map(candidature => {
                            const statusBadge = getStatusBadge(candidature.status);
                            return (
                                <div key={candidature.id} className="candidature-card">
                                    <div className="card-header">
                                        <div className="candidature-info">
                                            <h3>
                                                {candidature.etudiant?.user?.nom} {candidature.etudiant?.user?.prenom}
                                            </h3>
                                            <p className="stage-title">
                                                <strong>Stage:</strong> {candidature.stage?.titre}
                                            </p>
                                            <p className="entreprise-name">
                                                <strong>Entreprise:</strong> {candidature.stage?.entreprise?.nom}
                                            </p>
                                        </div>
                                        <div className={`status-badge ${statusBadge.class}`}>
                                            <span className="status-icon">{statusBadge.icon}</span>
                                            <span className="status-text">{statusBadge.text}</span>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <div className="candidature-details">
                                            <div className="detail-row">
                                                <div className="detail-item">
                                                    <span className="label">Email:</span>
                                                    <span>{candidature.etudiant?.user?.email}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Date de candidature:</span>
                                                    <span>{new Date(candidature.datePostulation).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="detail-row">
                                                <div className="detail-item">
                                                    <span className="label">Niveau:</span>
                                                    <span>{candidature.etudiant?.niveau || 'Non spécifié'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Filière:</span>
                                                    <span>{candidature.etudiant?.filiere || 'Non spécifiée'}</span>
                                                </div>
                                            </div>
                                        </div>                                        <div className="documents-section">
                                            <h4>Documents</h4>
                                            <div className="documents-grid">
                                                <div className="document-item">
                                                    {candidature.etudiant?.cv ? (
                                                        <a 
                                                            href={getFileUrl(candidature.etudiant.cv)} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="document-link"
                                                        >
                                                            Voir le CV
                                                        </a>
                                                    ) : (
                                                        <span className="document-missing">CV non fourni</span>
                                                    )}
                                                </div>
                                                <div className="document-item">
                                                    {candidature.etudiant?.lettreMotivation ? (
                                                        <a 
                                                            href={getFileUrl(candidature.etudiant.lettreMotivation)} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="document-link"
                                                        >
                                                            Voir la lettre de motivation
                                                        </a>
                                                    ) : (
                                                        <span className="document-missing">Lettre non fournie</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {candidature.commentaireEntreprise && (
                                            <div className="comment-section">
                                                <h4>Commentaire de l'entreprise</h4>
                                                <p>{candidature.commentaireEntreprise}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCandidatures;
