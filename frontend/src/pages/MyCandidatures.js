import React, { useEffect, useState } from 'react';
import { getEtudiantCandidatures } from '../services/candidatureService';
import '../styles/MyCandidatures.css';

const MyCandidatures = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const fetchCandidatures = async () => {
    setIsLoading(true);
    try {
      const data = await getEtudiantCandidatures();
      setCandidatures(data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de chargement des candidatures");
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusClass = (status) => {
    switch(status) {
      case 'en_attente': return 'status-pending';
      case 'validé': 
      case 'accepté': return 'status-accepted';
      case 'refusé': return 'status-rejected';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'en_attente': return 'En attente';
      case 'validé': 
      case 'accepté': return 'Acceptée';
      case 'refusé': return 'Refusée';
      default: return status;
    }
  };
  const getStatusIcon = (status) => {
    switch(status) {
      case 'en_attente': 
        return (
          <svg className="status-icon pending-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        );
      case 'validé':
      case 'accepté':
      case 'acceptee': 
        return (
          <svg className="status-icon accepted-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
        );
      case 'refusé':
      case 'refusee': 
        return (
          <svg className="status-icon rejected-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        );
      default: 
        return (
          <svg className="status-icon pending-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        );
    }
  };

  const getStatusMessage = (status) => {
    switch(status) {
      case 'en_attente': 
        return {
          message: "Votre candidature est en cours d'examen par l'entreprise.",
          type: "info"
        };
      case 'validé':
      case 'accepté': 
        return {
          message: "Félicitations ! Votre candidature a été acceptée. L'entreprise vous contactera bientôt.",
          type: "success"
        };
      case 'refusé': 
        return {
          message: "Votre candidature n'a pas été retenue cette fois. N'hésitez pas à postuler à d'autres offres.",
          type: "error"
        };
      default: 
        return null;
    }
  };  // Helper function to generate complete file URLs
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    
    // For uploaded files, use backend server to serve them
    if (filePath.startsWith('/uploads/')) {
      return `http://localhost:3001${filePath}`;
    }
    
    // For legacy files without /uploads/ prefix, add it
    return `http://localhost:3001/uploads/${filePath}`;
  };

  return (
    <div className="candidatures-container">
      <h2>Mes Candidatures</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="loading">Chargement...</div>
      ) : (
        <>
          {candidatures.length === 0 ? (
            <p>Vous n'avez pas encore de candidatures.</p>
          ) : (            <div className="candidatures-list">
              {candidatures.map(candidature => {                    const statusMessage = getStatusMessage(candidature.statut || candidature.status);
                return (                  <div key={candidature.id} className={`candidature-card status-${candidature.statut || candidature.status}`}>
                    <div className="candidature-header">
                      <div className="stage-info">
                        <h3>{candidature.Stage?.titre || candidature.stage?.titre || 'Stage non disponible'}</h3>
                        <span className="entreprise-name">
                          {candidature.Stage?.Entreprise?.nom || 
                           candidature.Stage?.entreprise?.nom || 
                           candidature.stage?.entreprise?.nom || 
                           'Entreprise non spécifiée'}
                        </span>
                      </div>
                      <div className={`status-container status-${candidature.statut || candidature.status}`}>                        {getStatusIcon(candidature.statut || candidature.status)}
                        <span className="status-text">
                          {getStatusText(candidature.statut || candidature.status)}
                        </span>
                      </div>
                    </div>

                    {statusMessage && (
                      <div className={`status-message ${statusMessage.type}`}>
                        <div className="message-content">
                          <span className="message-text">{statusMessage.message}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="candidature-details">
                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">📅 Période :</span>                          <span className="detail-value">
                            {candidature.Stage?.dateDebut || candidature.stage?.dateDebut ? 
                              `${new Date(candidature.Stage?.dateDebut || candidature.stage?.dateDebut).toLocaleDateString()} - ${new Date(candidature.Stage?.dateFin || candidature.stage?.dateFin).toLocaleDateString()}` :
                              'Dates non spécifiées'
                            }
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">📋 Candidature :</span>
                          <span className="detail-value">{new Date(candidature.datePostulation).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="documents-section">
                        <h4>📄 Documents soumis</h4>
                        <div className="documents-grid">
                          {candidature.cv ? (
                            <a href={getFileUrl(candidature.cv)} target="_blank" rel="noopener noreferrer" className="document-link cv-link">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10,9 9,9 8,9"/>
                              </svg>
                              <span>Voir mon CV</span>
                            </a>
                          ) : (
                            <div className="document-missing">
                              <span>CV non fourni</span>
                            </div>
                          )}
                          
                          {candidature.lettreMotivation ? (
                            <a href={getFileUrl(candidature.lettreMotivation)} target="_blank" rel="noopener noreferrer" className="document-link letter-link">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                              </svg>
                              <span>Voir ma lettre de motivation</span>
                            </a>
                          ) : (
                            <div className="document-missing">
                              <span>Lettre non fournie</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {candidature.commentaireEntreprise && (
                        <div className="entreprise-feedback">
                          <h4>💬 Commentaire de l'entreprise</h4>
                          <div className="feedback-content">
                            <p>{candidature.commentaireEntreprise}</p>
                          </div>
                        </div>
                      )}                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyCandidatures;