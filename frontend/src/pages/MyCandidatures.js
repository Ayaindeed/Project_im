import React, { useEffect, useState } from 'react';
import { getEtudiantCandidatures } from '../services/candidatureService';

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
      case 'validé': return 'status-accepted';
      case 'refusé': return 'status-rejected';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'en_attente': return 'En attente';
      case 'validé': return 'Acceptée';
      case 'refusé': return 'Refusée';
      default: return status;
    }
  };

  // Helper function to generate complete file URLs
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    const serverUrl = baseUrl.replace('/api', ''); // Remove /api to get server base URL
    return `${serverUrl}${filePath}`;
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
          ) : (
            <div className="candidatures-list">
              {candidatures.map(candidature => (
                <div key={candidature.id} className="candidature-card">
                  <div className="candidature-header">
                    <h3>{candidature.stage?.titre}</h3>
                    <span className={`status ${getStatusClass(candidature.status)}`}>
                      {getStatusText(candidature.status)}
                    </span>
                  </div>
                  
                  <div className="candidature-details">
                    <p><strong>Entreprise:</strong> {candidature.stage?.entreprise?.nom}</p>
                    <p><strong>Date de début:</strong> {new Date(candidature.stage?.dateDebut).toLocaleDateString()}</p>
                    <p><strong>Date de fin:</strong> {new Date(candidature.stage?.dateFin).toLocaleDateString()}</p>
                    <p><strong>Date de candidature:</strong> {new Date(candidature.datePostulation).toLocaleDateString()}</p>                    <div className="documents">
                      <p><strong>Documents soumis:</strong></p>
                      {candidature.cv && (
                        <a href={getFileUrl(candidature.cv)} target="_blank" rel="noopener noreferrer" className="document-link">
                          Voir mon CV
                        </a>
                      )}
                      {candidature.lettreMotivation && (
                        <a href={getFileUrl(candidature.lettreMotivation)} target="_blank" rel="noopener noreferrer" className="document-link">
                          Voir ma lettre de motivation
                        </a>
                      )}
                    </div>
                    {candidature.commentaireEntreprise && (
                      <div className="commentaire">
                        <p><strong>Commentaire de l'entreprise:</strong></p>
                        <p className="commentaire-text">{candidature.commentaireEntreprise}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyCandidatures;