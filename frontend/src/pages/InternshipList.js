import React, { useState, useEffect } from 'react';
import { getAllStages } from '../services/stageService';
import { submitCandidature } from '../services/candidatureService';
import '../styles/InternshipList.css';

const InternshipList = () => {
  const [stages, setStages] = useState([]);
  const [filteredStages, setFilteredStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedStage, setSelectedStage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('dateDebut'); 
  const [candidatureData, setCandidatureData] = useState({
    cv: null,
    lettreMotivation: null
  });

  useEffect(() => {
    fetchStages();
  }, []);

  useEffect(() => {
    filterStages();
  }, [stages, searchTerm, selectedSector, selectedStatus, sortBy]);

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

  const filterStages = () => {
    let filtered = [...stages];

    // Text search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(stage => 
        stage.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stage.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stage.entreprise?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stage.entreprise?.secteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stage.commentaire?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sector filter
    if (selectedSector) {
      filtered = filtered.filter(stage => 
        stage.entreprise?.secteur === selectedSector
      );
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(stage => stage.status === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dateDebut':
          return new Date(a.dateDebut) - new Date(b.dateDebut);
        case 'dateFin':
          return new Date(a.dateFin) - new Date(b.dateFin);
        case 'titre':
          return a.titre.localeCompare(b.titre);
        case 'entreprise':
          return (a.entreprise?.nom || '').localeCompare(b.entreprise?.nom || '');
        default:
          return 0;
      }
    });

    setFilteredStages(filtered);
  };

  // Get unique sectors for filter dropdown
  const getUniqueSectors = () => {
    const sectors = stages
      .map(stage => stage.entreprise?.secteur)
      .filter(Boolean)
      .filter((sector, index, array) => array.indexOf(sector) === index);
    return sectors.sort();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSector('');
    setSelectedStatus('');
    setSortBy('dateDebut');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFileChange = (event, type) => {
    setCandidatureData({
      ...candidatureData,
      [type]: event.target.files[0]
    });
  };

  const handlePostuler = async (stageId) => {
    try {
      setError(null);
      
      if (!candidatureData.cv || !candidatureData.lettreMotivation) {
        setError("Veuillez télécharger votre CV et votre lettre de motivation");
        return;
      }

      const formData = new FormData();
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
      <div className="internship-header">
        <h2>Stages Disponibles</h2>
        
        {/* Enhanced Search and Filter Section */}
        <div className="search-and-filters">
          <div className="search-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Rechercher par titre, entreprise, secteur ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="filters-container">
            <div className="filter-group">
              <label htmlFor="sector-filter">Secteur:</label>
              <select
                id="sector-filter"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="filter-select"
              >
                <option value="">Tous les secteurs</option>
                {getUniqueSectors().map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="status-filter">Statut:</label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                <option value="">Tous les statuts</option>
                <option value="disponible">Disponible</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort-select">Trier par:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="dateDebut">Date de début</option>
                <option value="dateFin">Date de fin</option>
                <option value="titre">Titre</option>
                <option value="entreprise">Entreprise</option>
              </select>
            </div>

            {(searchTerm || selectedSector || selectedStatus || sortBy !== 'dateDebut') && (
              <button onClick={clearFilters} className="clear-filters-btn">
                Effacer les filtres
              </button>
            )}
          </div>

          {/* Results Info */}
          <div className="results-info">
            <span className="results-count">
              {filteredStages.length} stage(s) affiché(s)
              {filteredStages.length !== stages.length && ` sur ${stages.length} total`}
            </span>
            {searchTerm && (
              <span className="search-term">
                pour "{searchTerm}"
              </span>
            )}
          </div>
        </div>
      </div>
      
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Chargement des stages...</span>
        </div>
      ) : filteredStages.length === 0 ? (
        <div className="no-results">
          {searchTerm ? 
            `Aucun stage trouvé pour "${searchTerm}"` : 
            "Aucun stage disponible pour le moment"
          }
        </div>
      ) : (
        <div className="internships-grid">
          {filteredStages.map(stage => (
            <div key={stage.id} className="internship-card">
              <div className="card-header">
                <h3 className="stage-title">{stage.titre}</h3>
                <span className={`status-badge status-${stage.status}`}>
                  {stage.status === 'disponible' && 'Disponible'}
                  {stage.status === 'en_cours' && 'En cours'}
                  {stage.status === 'termine' && 'Terminé'}
                </span>
              </div>
              
              <div className="company-info">
                <div className="company-name">
                  <strong>{stage.entreprise?.nom || 'Non spécifiée'}</strong>
                </div>
                <div className="company-sector">
                  {stage.entreprise?.secteur || 'Non spécifié'}
                </div>
              </div>

              <div className="internship-details">
                <div className="date-info">
                  <div className="date-item">
                    <span className="date-label">📅 Début</span>
                    <span className="date-value">
                      {new Date(stage.dateDebut).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">📅 Fin</span>
                    <span className="date-value">
                      {new Date(stage.dateFin).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="description-section">
                  <h4 className="section-title">Description</h4>
                  <p className="description">{stage.description}</p>
                </div>
                
                {stage.commentaire && (
                  <div className="comment-section">
                    <h4 className="section-title">Informations complémentaires</h4>
                    <p className="comment">{stage.commentaire}</p>
                  </div>
                )}

                <div className="duration-info">
                  <span className="duration-label">⏱️ Durée:</span>
                  <span className="duration-value">
                    {Math.ceil((new Date(stage.dateFin) - new Date(stage.dateDebut)) / (1000 * 60 * 60 * 24))} jours
                  </span>
                </div>
              </div>
              
              <div className="card-actions">
                <button 
                  className="btn btn-primary apply-btn"
                  onClick={() => openPostulerModal(stage)}
                >
                  Postuler maintenant
                </button>
              </div>
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