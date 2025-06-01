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

    useEffect(() => {
        fetchStages();
    }, []);    // Helper function to get status display text
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

    // Helper function to get file URL
    const getFileUrl = (filePath) => {
        if (!filePath) return null;
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
        const serverBaseUrl = baseUrl.replace('/api', '');
        
        // If the path already starts with http, return as is
        if (filePath.startsWith('http')) {
            return filePath;
        }
        
        // If the path starts with /uploads, add the server base URL
        if (filePath.startsWith('/uploads')) {
            return `${serverBaseUrl}${filePath}`;
        }
        
        // Otherwise, assume it's a relative path and add /uploads/
        return `${serverBaseUrl}/uploads/${filePath}`;
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
        // Add confirmation dialog
        const action = status === 'accepté' ? 'accepter' : 'refuser';
        const confirmMessage = `Êtes-vous sûr de vouloir ${action} cette candidature ?`;
        
        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            setLoading(true);
            
            // Add visual feedback to button
            const buttonClass = status === 'accepté' ? 'success-animation' : 'danger-animation';
            const buttonElement = document.querySelector(`.btn-${status === 'accepté' ? 'success' : 'danger'}`);
            if (buttonElement) {
                buttonElement.classList.add(buttonClass);
                setTimeout(() => buttonElement.classList.remove(buttonClass), 600);
            }
            
            await traiterCandidature(candidatureId, {
                status,
                commentaire: comment
            });
            
            // Show success message
            const successMessage = status === 'accepté' 
                ? '✅ Candidature acceptée avec succès !' 
                : '❌ Candidature refusée avec succès !';
            
            // You could replace this with a toast notification
            alert(successMessage);
            
            // Refresh candidatures after processing
            if (selectedStage) {
                handleStageSelect(selectedStage.id);
            }
            
            setComment('');
        } catch (err) {
            setError("Erreur lors du traitement de la candidature");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="candidatures-container">
            <h2>Gestion des Candidatures</h2>
            
            {error && <div className="error-message">{error}</div>}
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

            {selectedStage && (
                <div className="candidatures-list">
                    {candidatures.length > 0 ? (
                        candidatures.map(candidature => (
                            <div key={candidature.id} className="candidature-card">                                <div className="candidature-header">
                                    <h3>{candidature.etudiant.nom} {candidature.etudiant.prenom}</h3>
                                    <span className={`status ${candidature.status}`}>
                                        {getStatusText(candidature.status)}
                                    </span>
                                </div>                                <div className="candidature-details">
                                    <p><strong>Date de postulation:</strong> {new Date(candidature.datePostulation).toLocaleDateString()}</p>
                                    <p><strong>CV:</strong> {
                                        candidature.etudiant.cv ? (
                                            <a href={getFileUrl(candidature.etudiant.cv)} target="_blank" rel="noopener noreferrer">Voir le CV</a>
                                        ) : (
                                            <span style={{color: '#999'}}>Non fourni</span>
                                        )
                                    }</p>
                                    <p><strong>Lettre de motivation:</strong> {
                                        candidature.etudiant.lettreMotivation ? (
                                            <a href={getFileUrl(candidature.etudiant.lettreMotivation)} target="_blank" rel="noopener noreferrer">Voir la lettre</a>
                                        ) : (
                                            <span style={{color: '#999'}}>Non fournie</span>
                                        )
                                    }</p>
                                </div>                                {candidature.status === 'en_attente' && (
                                    <div className="candidature-actions">
                                        <textarea
                                            placeholder="Ajouter un commentaire..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="comment-input"
                                        />
                                        <div className="button-group">
                                            <button 
                                                onClick={() => handleTraiter(candidature.id, 'accepté')}
                                                className="btn btn-success"
                                                disabled={loading}
                                                title="Accepter cette candidature"
                                            >
                                                <span className="btn-icon">✓</span>
                                                <span className="btn-text">Accepter</span>
                                                {loading && <span className="btn-loader"></span>}
                                            </button>
                                            <button 
                                                onClick={() => handleTraiter(candidature.id, 'refusé')}
                                                className="btn btn-danger"
                                                disabled={loading}
                                                title="Refuser cette candidature"
                                            >
                                                <span className="btn-icon">✕</span>
                                                <span className="btn-text">Refuser</span>
                                                {loading && <span className="btn-loader"></span>}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {candidature.commentaireEntreprise && (
                                    <div className="candidature-comment">
                                        <strong>Commentaire:</strong>
                                        <p>{candidature.commentaireEntreprise}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="no-candidatures">Aucune candidature pour ce stage</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default EntrepriseCandidatures;