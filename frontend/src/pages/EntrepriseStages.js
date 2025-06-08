import React, { useState, useEffect } from 'react';
import { getEntrepriseStages, createStage, updateStage, deleteStage } from '../services/stageService';
import '../styles/EntrepriseStages.css';

const EntrepriseStages = () => {
  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);  const [showForm, setShowForm] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    commentaire: ''
  });

  // Fonction pour calculer la durée en jours entre deux dates
  const calculateDuration = (dateDebut, dateFin) => {
    if (!dateDebut || !dateFin) return 'Non spécifiée';
    
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '1 jour';
    if (diffDays === 1) return '1 jour';
    if (diffDays < 7) return `${diffDays} jours`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      const remainingDays = diffDays % 7;
      if (remainingDays === 0) {
        return weeks === 1 ? '1 semaine' : `${weeks} semaines`;
      } else {
        return weeks === 1 ? `1 semaine et ${remainingDays} jour${remainingDays > 1 ? 's' : ''}` : `${weeks} semaines et ${remainingDays} jour${remainingDays > 1 ? 's' : ''}`;
      }
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      if (remainingDays === 0) {
        return months === 1 ? '1 mois' : `${months} mois`;
      } else {
        return months === 1 ? `1 mois et ${remainingDays} jour${remainingDays > 1 ? 's' : ''}` : `${months} mois et ${remainingDays} jour${remainingDays > 1 ? 's' : ''}`;
      }
    }    return `${diffDays} jours`;
  };

  // Fonction pour filtrer les stages selon le terme de recherche
  const filteredStages = stages.filter(stage => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      stage.titre?.toLowerCase().includes(searchLower) ||
      stage.description?.toLowerCase().includes(searchLower) ||
      stage.commentaire?.toLowerCase().includes(searchLower)
    );
  });

  // Fonction pour réinitialiser la recherche
  const clearSearch = () => {
    setSearchTerm('');
  };

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
      if (editingStage) {
        await updateStage(editingStage.id, formData);
      } else {
        await createStage(formData);
      }
      setShowForm(false);
      setEditingStage(null);
      setFormData({
        titre: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        commentaire: ''
      });
      fetchStages();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la sauvegarde du stage");
    }
  };

  const handleEdit = (stage) => {
    setEditingStage(stage);
    setFormData({
      titre: stage.titre,
      description: stage.description,
      dateDebut: stage.dateDebut ? stage.dateDebut.split('T')[0] : '',
      dateFin: stage.dateFin ? stage.dateFin.split('T')[0] : '',
      commentaire: stage.commentaire || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (stageId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        await deleteStage(stageId);
        fetchStages();
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors de la suppression du stage");
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStage(null);
    setFormData({
      titre: '',
      description: '',
      dateDebut: '',
      dateFin: '',
      commentaire: ''
    });
  };

  return (
    <div className="stages-container">      <div className="stages-header">
        <h2>Mes Offres de Stage</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Ajouter une offre
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher par titre, description ou commentaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={clearSearch}
              title="Effacer la recherche"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results-info">
            {filteredStages.length} offre{filteredStages.length !== 1 ? 's' : ''} trouvée{filteredStages.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}      {showForm && (
        <div className="stage-form">
          <h3>{editingStage ? 'Modifier l\'offre de stage' : 'Nouvelle offre de stage'}</h3>
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
            </div>            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingStage ? 'Modifier' : 'Créer'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleCancelForm}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="loading">Chargement...</div>
      ) : (        <div className="stages-grid">
          {Array.isArray(filteredStages) && filteredStages.length > 0 ? (
            filteredStages.map(stage => (
              <div key={stage.id} className="stage-offer-card">
                <div className="stage-card-header">
                  <h3 className="stage-title">{stage.titre}</h3>                  <div className="stage-actions">
                    <button 
                      className="stage-edit-btn"
                      onClick={() => handleEdit(stage)}
                      title="Modifier l'offre"
                    >
                      <svg className="action-icon edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button 
                      className="stage-delete-btn"
                      onClick={() => handleDelete(stage.id)}
                      title="Supprimer l'offre"
                    >
                      <svg className="action-icon delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2 0 0 1-2,2H7a2,2 0 0 1-2-2V6m3,0V4a2,2 0 0 1,2-2h4a2,2 0 0 1,2,2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="stage-card-body">                  <div className="stage-meta">
                    <div className="stage-duration">
                      <span className="meta-label">Durée:</span>
                      <span className="meta-value">{calculateDuration(stage.dateDebut, stage.dateFin)}</span>
                    </div>
                    <div className="stage-period">
                      <span className="meta-label">Période:</span>
                      <span className="meta-value">
                        {new Date(stage.dateDebut).toLocaleDateString()} - {new Date(stage.dateFin).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="stage-description">
                    <p>{stage.description}</p>
                  </div>
                  {stage.commentaire && (
                    <div className="stage-comment">
                      <span className="comment-label">Note:</span>
                      <p>{stage.commentaire}</p>
                    </div>
                  )}
                </div>
              </div>            ))
          ) : (
            <div className="no-stages">
              {searchTerm ? (
                <>
                  <p>Aucune offre de stage trouvée pour "{searchTerm}"</p>
                  <button 
                    className="btn btn-secondary"
                    onClick={clearSearch}
                  >
                    Effacer la recherche
                  </button>
                </>
              ) : (
                <>
                  <p>Aucune offre de stage disponible.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                  >
                    Créer votre première offre
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EntrepriseStages;