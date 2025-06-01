import React, { useState, useEffect } from 'react';
import { getEntrepriseStages, createStage } from '../services/stageService';

const EntrepriseStages = () => {
  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    commentaire: ''
  });

  useEffect(() => {
    fetchStages();
  }, []);
  const fetchStages = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching enterprise stages...');
      const response = await getEntrepriseStages();
      console.log('Received stages:', response);
      
      // Handle both cases where the API returns data directly or nested in data property
      const stagesData = response.data ? response.data : response;
      setStages(Array.isArray(stagesData) ? stagesData : []);
    } catch (err) {
      console.error('Error fetching stages:', err);
      setError(err.response?.data?.message || "Erreur lors du chargement des stages");
      setStages([]); // Ensure stages is always an array
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStage(formData);      setShowForm(false);      setFormData({
        titre: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        commentaire: ''
      });
      fetchStages();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création du stage");
    }
  };

  return (
    <div className="stages-container">
      <div className="stages-header">
        <h2>Mes Offres de Stage</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Ajouter une offre
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="stage-form">
          <h3>Nouvelle offre de stage</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Titre</label>
              <input
                type="text"
                className="form-control"
                value={formData.titre}
                onChange={e => setFormData({...formData, titre: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
                rows="4"
              />
            </div>            <div className="form-group">
              <label>Commentaire</label>
              <textarea
                className="form-control"
                value={formData.commentaire}
                onChange={e => setFormData({...formData, commentaire: e.target.value})}
                placeholder="Informations supplémentaires"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date de début</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.dateDebut}
                  onChange={e => setFormData({...formData, dateDebut: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date de fin</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.dateFin}
                  onChange={e => setFormData({...formData, dateFin: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Créer</button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="loading">Chargement...</div>
      ) : (
        <div className="stages-grid">
          {Array.isArray(stages) && stages.length > 0 ? (
            stages.map(stage => (
              <div key={stage.id} className="stage-card">
                <h3>{stage.titre}</h3>
                <div className="stage-details">
                  <p><strong>Durée:</strong> {stage.duree}</p>
                  <p><strong>Période:</strong> {new Date(stage.dateDebut).toLocaleDateString()} - {new Date(stage.dateFin).toLocaleDateString()}</p>
                  <p className="description">{stage.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Aucun stage disponible.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EntrepriseStages;