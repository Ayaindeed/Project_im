import React, { useState, useEffect } from 'react';
import { getEntrepriseStages } from '../services/stageService';
import { traiterCandidature } from '../services/candidatureService';
import { getCandidatures } from '../services/candidatureService';
import '../styles/EntrepriseCandidatures.css';

const EntrepriseCandidatures = () => {
    const [stages, setStages] = useState([]);
    const [selectedStage, setSelectedStage] = useState(null);
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [processingId, setProcessingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');    useEffect(() => {
        fetchStages();
    }, []);

    // Filter candidatures based on search term
    const filteredCandidatures = candidatures.filter(candidature => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            candidature.etudiant.nom.toLowerCase().includes(searchLower) ||
            candidature.etudiant.prenom.toLowerCase().includes(searchLower) ||
            getStatusText(candidature.status).toLowerCase().includes(searchLower)
        );
    });

    // Helper function to get status display text
    const getStatusText = (status) => {
        switch (status) {
            case 'en_attente':
                return 'En attente';
            case 'accepté':
                return 'Acceptée';
            case 'refusé':
                return 'Refusée';
            default:
                return status;
        }
    };

    // Helper function to get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'en_attente':
                return (
                    <svg viewBox="0 0 24 24" className="status-icon pending">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <path d="m9 12 2 2 4-4" fill="none" stroke="none"/>
                        <circle cx="12" cy="12" r="3" fill="currentColor"/>
                    </svg>
                );
            case 'accepté':
                return (
                    <svg viewBox="0 0 24 24" className="status-icon accepted">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                );
            case 'refusé':
                return (
                    <svg viewBox="0 0 24 24" className="status-icon rejected">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <path d="m15 9-6 6" stroke="currentColor" strokeWidth="2"/>
                        <path d="m9 9 6 6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                );
            default:
                return null;
        }
    };    // Helper function to get file URL
    const getFileUrl = (filePath) => {
        if (!filePath) return null;
        
        // For uploaded files, use backend server to serve them
        if (filePath.startsWith('/uploads/')) {
            return `http://localhost:3001${filePath}`;
        }
        
        // For legacy files without /uploads/ prefix, add it
        return `http://localhost:3001/uploads/${filePath}`;
    };const fetchStages = async () => {
        try {
            setLoading(true);
            const data = await getEntrepriseStages();
            console.log("Raw API response:", data);
            console.log("Data type:", typeof data);
            console.log("Is array:", Array.isArray(data));
            if (data && data.length > 0) {
                console.log("First stage structure:", data[0]);
                console.log("First stage candidatures:", data[0].candidatures);
            }
            setStages(data);
        } catch (err) {
            setError("Erreur lors du chargement des stages");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStageSelect = (stageId) => {
        console.log("Stage ID sélectionné:", stageId);
        console.log("Type de stageId:", typeof stageId);
        
        // Conversion en nombre si c'est une chaîne
        const id = typeof stageId === 'string' ? parseInt(stageId, 10) : stageId;
        
        const stage = stages.find(s => s.id === id);
        console.log("Stage trouvé:", stage);
        
        setSelectedStage(stage);
        
        if (stage?.candidatures) {
            console.log("Candidatures trouvées:", stage.candidatures);
            setCandidatures(stage.candidatures);
        } else {
            console.log("Aucune candidature trouvée pour ce stage");
            setCandidatures([]);
        }
    };    const handleTraiter = async (candidatureId, status) => {
        try {
            setProcessingId(candidatureId);
            setLoading(true);
            await traiterCandidature(candidatureId, {
                status,
                commentaire: comment
            });
            
            // Refresh candidatures after processing
            if (selectedStage) {
                handleStageSelect(selectedStage.id);
            }
            
            setComment('');
            
            // Show success feedback
            setTimeout(() => setProcessingId(null), 1000);
        } catch (err) {
            setError("Erreur lors du traitement de la candidature");
            console.error(err);
            setProcessingId(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }    return (
        <div className="candidatures-container">
            <div className="page-header">
                <h2>Gestion des Candidatures</h2>
                <div className="candidatures-summary">
                    {selectedStage && (
                        <div className="summary-stats">
                            <div className="stat-item">
                                <span className="stat-number">{candidatures.length}</span>
                                <span className="stat-label">Total</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{candidatures.filter(c => c.status === 'en_attente').length}</span>
                                <span className="stat-label">En attente</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{candidatures.filter(c => c.status === 'accepté').length}</span>
                                <span className="stat-label">Acceptées</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{candidatures.filter(c => c.status === 'refusé').length}</span>
                                <span className="stat-label">Refusées</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="controls-section">
                <div className="stage-selector">
                    <select 
                        onChange={(e) => handleStageSelect(e.target.value)}
                        value={selectedStage?.id || ''}
                    >
                        <option value="">Sélectionner un stage</option>
                        {stages.map(stage => (
                            <option key={stage.id} value={stage.id}>
                                {stage.titre} {stage.candidatures?.length > 0 ? `(${stage.candidatures.length} candidature(s))` : '(0 candidature)'}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedStage && candidatures.length > 0 && (
                    <div className="search-container">
                        <div className="search-box">
                            <svg className="search-icon" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Rechercher par nom ou statut..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="search-clear"
                                    aria-label="Effacer la recherche"
                                >
                                    <svg viewBox="0 0 24 24">
                                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="search-results">
                            {searchTerm && (
                                <span className="results-count">
                                    {filteredCandidatures.length} résultat{filteredCandidatures.length !== 1 ? 's' : ''} trouvé{filteredCandidatures.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>            {selectedStage && (
                <div className="candidatures-list">
                    {filteredCandidatures.length > 0 ? (
                        filteredCandidatures.map(candidature => (
                            <div key={candidature.id} className="candidature-card">
                                <div className="candidature-header">
                                    <div className="candidature-title">
                                        <h3>{candidature.etudiant.nom} {candidature.etudiant.prenom}</h3>
                                        <span className="candidature-date">
                                            Postulé le {new Date(candidature.datePostulation).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                    <div className={`status-badge ${candidature.status}`}>
                                        {getStatusIcon(candidature.status)}
                                        <span className="status-text">{getStatusText(candidature.status)}</span>
                                    </div>
                                </div>

                                <div className="candidature-details">
                                    <div className="detail-item">
                                        <strong>Email:</strong> 
                                        <span>{candidature.etudiant.email}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>CV:</strong> 
                                        {candidature.etudiant.cv ? (
                                            <a href={getFileUrl(candidature.etudiant.cv)} target="_blank" rel="noopener noreferrer" className="document-link">
                                                <svg viewBox="0 0 24 24" className="document-icon">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2"/>
                                                    <polyline points="14,2 14,8 20,8" fill="none" stroke="currentColor" strokeWidth="2"/>
                                                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                                                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                                                    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
                                                Télécharger le CV
                                            </a>
                                        ) : (
                                            <span className="missing-document">Non fourni</span>
                                        )}
                                    </div>
                                    <div className="detail-item">
                                        <strong>Lettre de motivation:</strong> 
                                        {candidature.etudiant.lettreMotivation ? (
                                            <a href={getFileUrl(candidature.etudiant.lettreMotivation)} target="_blank" rel="noopener noreferrer" className="document-link">
                                                <svg viewBox="0 0 24 24" className="document-icon">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2"/>
                                                    <polyline points="14,2 14,8 20,8" fill="none" stroke="currentColor" strokeWidth="2"/>
                                                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                                                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                                                    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
                                                Télécharger la lettre
                                            </a>
                                        ) : (
                                            <span className="missing-document">Non fournie</span>
                                        )}
                                    </div>
                                </div>

                                {candidature.status === 'en_attente' && (
                                    <div className="candidature-actions">
                                        <div className="comment-section">
                                            <label htmlFor={`comment-${candidature.id}`} className="comment-label">
                                                Commentaire (optionnel)
                                            </label>
                                            <textarea
                                                id={`comment-${candidature.id}`}
                                                placeholder="Ajouter un commentaire pour l'étudiant..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="comment-input"
                                            />
                                        </div>
                                        <div className="button-group">
                                            <button 
                                                onClick={() => handleTraiter(candidature.id, 'accepté')}
                                                className={`btn btn-success ${processingId === candidature.id ? 'loading' : ''}`}
                                                disabled={processingId === candidature.id}
                                            >
                                                <span className="btn-icon">✓</span>
                                                <span className="btn-text">Accepter</span>
                                                {processingId === candidature.id && <div className="btn-loader"></div>}
                                            </button>
                                            <button 
                                                onClick={() => handleTraiter(candidature.id, 'refusé')}
                                                className={`btn btn-danger ${processingId === candidature.id ? 'loading' : ''}`}
                                                disabled={processingId === candidature.id}
                                            >
                                                <span className="btn-icon">✕</span>
                                                <span className="btn-text">Refuser</span>
                                                {processingId === candidature.id && <div className="btn-loader"></div>}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {candidature.commentaireEntreprise && (
                                    <div className="candidature-comment">
                                        <strong>Votre commentaire:</strong>
                                        <p>{candidature.commentaireEntreprise}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-candidatures">
                            {searchTerm ? (
                                <>
                                    <svg viewBox="0 0 24 24" className="no-results-icon">
                                        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                                        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    <h3>Aucun résultat trouvé</h3>
                                    <p>Aucune candidature ne correspond à votre recherche "{searchTerm}"</p>
                                    <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
                                        Effacer la recherche
                                    </button>
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" className="no-candidatures-icon">
                                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                    </svg>
                                    <h3>Aucune candidature</h3>
                                    <p>Il n'y a pas encore de candidature pour ce stage</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EntrepriseCandidatures;