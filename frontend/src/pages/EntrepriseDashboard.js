import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEntrepriseStats } from '../services/entrepriseService';
import { createStage } from '../services/stageService';

const EntrepriseDashboard = () => {
  const [stats, setStats] = useState({
    totalStages: 0,
    candidaturesEnAttente: 0,
    stagesActifs: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    commentaire: ''
  });
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const data = await getEntrepriseStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();

    // Écouter les événements de mise à jour des statistiques
    const handleStatsUpdate = (event) => {
      if (event.detail) {
        setStats(event.detail);
      } else {
        // Si pas de détails, refaire un appel API
        fetchStats();
      }
    };

    // Écouter les candidatures traitées pour rafraîchir les stats
    const handleCandidatureUpdate = () => {
      // Petit délai pour s'assurer que le backend a traité la candidature
      setTimeout(fetchStats, 1000);
    };

    window.addEventListener('statsUpdated', handleStatsUpdate);
    window.addEventListener('candidatureTraitee', handleCandidatureUpdate);

    return () => {
      window.removeEventListener('statsUpdated', handleStatsUpdate);
      window.removeEventListener('candidatureTraitee', handleCandidatureUpdate);    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createStage(formData);
      setShowForm(false);
      setFormData({
        titre: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        commentaire: ''
      });
      setError(null);
      // Rafraîchir les stats après création
      const data = await getEntrepriseStats();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création de l'offre");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setFormData({
      titre: '',
      description: '',
      dateDebut: '',
      dateFin: '',
      commentaire: ''
    });
    setError(null);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Tableau de bord Entreprise</h1>
        <p className="welcome-text">Bienvenue, {user?.nom}</p>
      </div>

      {isLoading ? (
        <div className="loading">Chargement...</div>
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Mes Offres de Stage</h3>
            <p className="stat">{stats.totalStages}</p>
            <Link to="/mes-stages" className="card-link">
              Gérer mes offres →
            </Link>
          </div>

          <div className="dashboard-card">
            <h3>Candidatures en Attente</h3>
            <p className="stat">{stats.candidaturesEnAttente}</p>
            <Link to="/entreprise-candidatures" className="card-link">
              Voir les candidatures →
            </Link>
          </div>          <div className="dashboard-card">
            <h3>Nouvelle Offre</h3>
            {!showForm ? (
              <>
                <p>Publiez une nouvelle offre de stage</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  Créer une offre
                </button>
              </>
            ) : (
              <div className="stage-form">
                <h4>Nouvelle offre de stage</h4>
                {error && <div className="error-message">{error}</div>}
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
                  </div>

                  <div className="form-group">
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
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? 'Création...' : 'Créer'}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default EntrepriseDashboard;