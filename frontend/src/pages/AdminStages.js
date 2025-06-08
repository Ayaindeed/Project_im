import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllStagesForAdmin, updateStageStatusAdmin } from '../services/adminService';
import AdminNotifications from '../components/AdminNotifications';
import '../styles/AdminPages.css';

const AdminStages = () => {
    const [stages, setStages] = useState([]);
    const [filteredStages, setFilteredStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');    useEffect(() => {
        fetchStages();
        
        // Écouter les événements de synchronisation
        const handleAdminSync = () => {
            console.log('AdminStages: Synchronisation des données');
            fetchStages();
        };

        const handleStatsUpdate = () => {
            console.log('AdminStages: Stats mises à jour');
            fetchStages();
        };

        const handleCandidatureUpdate = () => {
            console.log('AdminStages: Candidature traitée');
            setTimeout(() => {
                fetchStages();
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
        filterStages();
    }, [stages, searchTerm, statusFilter]);    const fetchStages = async () => {
        try {
            setLoading(true);
            const data = await getAllStagesForAdmin();
            setStages(data);
        } catch (err) {
            setError('Erreur lors du chargement des stages');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterStages = () => {
        let filtered = [...stages];

        if (searchTerm.trim()) {
            filtered = filtered.filter(stage =>
                stage.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                stage.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                stage.entreprise?.nom.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(stage => stage.status === statusFilter);
        }

        setFilteredStages(filtered);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'disponible': { class: 'status-available', text: 'Disponible' },
            'en_cours': { class: 'status-active', text: 'En cours' },
            'termine': { class: 'status-finished', text: 'Terminé' }
        };
        return statusConfig[status] || { class: 'status-unknown', text: status };
    };

    if (loading) return <div className="loading">Chargement...</div>;
    if (error) return <div className="error-message">{error}</div>;    return (
        <div className="admin-page">
            <AdminNotifications />
            <div className="page-header">
                <div className="header-content">
                    <h1>Gestion des Stages</h1>
                    <Link to="/admin-dashboard" className="back-btn">
                        ← Retour au tableau de bord
                    </Link>
                </div>
                <div className="page-stats">
                    <div className="stat-item">
                        <span className="stat-number">{stages.length}</span>
                        <span className="stat-label">Total stages</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{stages.filter(s => s.status === 'disponible').length}</span>
                        <span className="stat-label">Disponibles</span>
                    </div>
                </div>
            </div>

            <div className="page-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Rechercher par titre, description ou entreprise..."
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
                        <option value="disponible">Disponible</option>
                        <option value="en_cours">En cours</option>
                        <option value="termine">Terminé</option>
                    </select>
                </div>
            </div>

            <div className="content-section">
                {filteredStages.length === 0 ? (
                    <div className="no-results">
                        {searchTerm || statusFilter ? 
                            'Aucun stage ne correspond aux critères de recherche' :
                            'Aucun stage disponible'
                        }
                    </div>
                ) : (
                    <div className="stages-grid">
                        {filteredStages.map(stage => (
                            <div key={stage.id} className="stage-card">
                                <div className="card-header">
                                    <h3>{stage.titre}</h3>
                                    <span className={`status-badge ${getStatusBadge(stage.status).class}`}>
                                        {getStatusBadge(stage.status).text}
                                    </span>
                                </div>
                                <div className="card-content">
                                    <p className="entreprise-name">
                                        <strong>Entreprise:</strong> {stage.entreprise?.nom || 'Non spécifiée'}
                                    </p>
                                    <p className="stage-description">
                                        {stage.description.length > 150 ? 
                                            stage.description.substring(0, 150) + '...' : 
                                            stage.description
                                        }
                                    </p>
                                    <div className="stage-details">
                                        <div className="detail-item">
                                            <span className="label">Début:</span>
                                            <span>{new Date(stage.dateDebut).toLocaleDateString()}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="label">Fin:</span>
                                            <span>{new Date(stage.dateFin).toLocaleDateString()}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="label">Candidatures:</span>
                                            <span>{stage.candidatures?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminStages;
