import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEntrepriseStats } from '../services/entrepriseService';

const EntrepriseDashboard = () => {
  const [stats, setStats] = useState({
    totalStages: 0,
    candidaturesEnAttente: 0,
    stagesActifs: 0
  });
  const [isLoading, setIsLoading] = useState(false);
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
      window.removeEventListener('candidatureTraitee', handleCandidatureUpdate);
    };
  }, []);

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
          </div>

          <div className="dashboard-card">
            <h3>Nouvelle Offre</h3>
            <p>Publiez une nouvelle offre de stage</p>
            <Link to="/submit-stage" className="btn btn-primary">
              Créer une offre
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntrepriseDashboard;