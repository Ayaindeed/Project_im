import React, { useState, useEffect } from 'react';
import { getAllStages } from '../services/stageService';
import { submitCandidature } from '../services/candidatureService';

const InternshipList = () => {
  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedStage, setSelectedStage] = useState(null);
  const [candidatureData, setCandidatureData] = useState({
    cv: null,
    lettreMotivation: null
  });

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllStages();
      console.log('Stages data:', data); // Debug log
      if (Array.isArray(data)) {
        setStages(data);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError("Erreur lors du chargement des stages: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event, type) => {
    setCandidatureData({
      ...candidatureData,
      [type]: event.target.files[0]
    });
  };

  const handlePostuler = async (stageId) => {
    try {
      setError(null); // Clear any previous errors
      
      if (!candidatureData.cv || !candidatureData.lettreMotivation) {
        setError("Veuillez télécharger votre CV et votre lettre de motivation");
        return;
      }

      const formData = new FormData();
      // Nous n'avons plus besoin d'ajouter stageId au formData car il est dans l'URL
      formData.append('cv', candidatureData.cv);
      formData.append('lettreMotivation', candidatureData.lettreMotivation);

      console.log('Envoi de la candidature pour le stage ID:', stageId);
      const response = await submitCandidature(stageId, formData);
      console.log('Candidature soumise:', response);
      setSuccessMessage('Candidature envoyée avec succès!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setSelectedStage(null);
      setCandidatureData({ cv: null, lettreMotivation: null });
      
      // Refresh the stages to update UI
      fetchStages();
    } catch (err) {
      console.error('Erreur lors de l\'envoi de la candidature:', err);
      setError(err.response?.data?.message || "Erreur lors de l'envoi de la candidature");
    }
  };

  const openPostulerModal = (stage) => {
    setSelectedStage(stage);
  };

  return (
    <div className="internship-list">
      <h2>Stages Disponibles</h2>
      
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="loading">Chargement...</div>
      ) : (
        <div className="internships-grid">
          {stages.map(stage => (
            <div key={stage.id} className="internship-card">
              <h3>{stage.titre}</h3>
              <div className="internship-details">
                <p><strong>Entreprise:</strong> {stage.entreprise?.nom || 'Non spécifiée'}</p>
                <p><strong>Secteur:</strong> {stage.entreprise?.secteur || 'Non spécifié'}</p>
                <p><strong>Date de début:</strong> {new Date(stage.dateDebut).toLocaleDateString()}</p>
                <p><strong>Date de fin:</strong> {new Date(stage.dateFin).toLocaleDateString()}</p>
                <p className="description">{stage.description}</p>
                {stage.commentaire && <p><strong>Commentaire:</strong> {stage.commentaire}</p>}
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => openPostulerModal(stage)}
              >
                Postuler
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedStage && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Postuler pour: {selectedStage.titre}</h3>
              <span className="close-button" onClick={() => setSelectedStage(null)}>&times;</span>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="modal-body">
              <p><strong>Entreprise:</strong> {selectedStage.entreprise?.nom}</p>
              <p><strong>Description:</strong> {selectedStage.description}</p>
              <p><strong>Période:</strong> Du {new Date(selectedStage.dateDebut).toLocaleDateString()} au {new Date(selectedStage.dateFin).toLocaleDateString()}</p>
              
              <div className="form-group">
                <label>CV (PDF uniquement)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'cv')}
                  required
                />
                {candidatureData.cv && <span className="file-selected">✓ Fichier sélectionné: {candidatureData.cv.name}</span>}
              </div>
              <div className="form-group">
                <label>Lettre de Motivation (PDF uniquement)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'lettreMotivation')}
                  required
                />
                {candidatureData.lettreMotivation && <span className="file-selected">✓ Fichier sélectionné: {candidatureData.lettreMotivation.name}</span>}
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-primary"
                onClick={() => handlePostuler(selectedStage.id)}
                disabled={!candidatureData.cv || !candidatureData.lettreMotivation}
              >
                Envoyer la candidature
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedStage(null)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipList;