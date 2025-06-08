import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEtudiantCandidatures } from '../services/candidatureService';
import { getAllStages } from '../services/stageService';

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
    }
    return `${diffDays} jours`;
};

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [candidatures, setCandidatures] = useState([]);
    const [stats, setStats] = useState({
        totalCandidatures: 0,
        enAttente: 0,
        acceptees: 0,
        refusees: 0
    });
    const [recentStages, setRecentStages] = useState([]);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Récupérer les candidatures de l'étudiant
                const candidaturesData = await getEtudiantCandidatures();
                console.log('Dashboard candidatures data:', candidaturesData);
                setCandidatures(candidaturesData);

                // Calculer les statistiques
                const statsData = {
                    totalCandidatures: candidaturesData.length,
                    enAttente: candidaturesData.filter(c => c.status === 'en_attente').length,
                    acceptees: candidaturesData.filter(c => c.status === 'accepté').length,
                    refusees: candidaturesData.filter(c => c.status === 'refusé').length
                };
                setStats(statsData);

                // Récupérer quelques stages récents pour affichage
                const stagesData = await getAllStages();
                console.log('Dashboard stages data:', stagesData);
                setRecentStages(stagesData.slice(0, 3)); // Les 3 premiers stages

            } catch (err) {
                console.error('Dashboard fetch error:', err);
                setError(err.message || 'Erreur lors du chargement des données');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatutBadge = (statut) => {
        const badges = {
            'en_attente': { 
                class: 'status-pending', 
                text: 'En attente',
                icon: '⏳'
            },
            'accepté': { 
                class: 'status-accepted', 
                text: 'Acceptée',
                icon: '✅'
            },
            'refusé': { 
                class: 'status-rejected', 
                text: 'Refusée',
                icon: '❌'
            }
        };
        return badges[statut] || { class: 'status-pending', text: statut, icon: '⏳' };
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Tableau de bord Étudiant</h1>
                <p className="welcome-text">
                    Bienvenue, {user.prenom} {user.nom} ! 
                    Voici un aperçu de vos candidatures et des nouvelles opportunités.
                </p>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {isLoading ? (
                <div className="loading">Chargement de votre tableau de bord...</div>
            ) : (
                <>
                    {/* Statistiques des candidatures */}
                    <div className="dashboard-grid">
                        <div className="dashboard-card stats-card">
                            <div className="stat-icon">📋</div>
                            <h3>Mes Candidatures</h3>
                            <p className="stat">{stats.totalCandidatures}</p>
                            <p className="stat-detail">Total des candidatures</p>
                            <Link to="/mes-candidatures" className="card-link">
                                Voir toutes mes candidatures →
                            </Link>
                        </div>

                        <div className="dashboard-card stats-card pending">
                            <div className="stat-icon">⏳</div>
                            <h3>En Attente</h3>
                            <p className="stat">{stats.enAttente}</p>
                            <p className="stat-detail">Candidatures en cours</p>
                        </div>

                        <div className="dashboard-card stats-card accepted">
                            <div className="stat-icon">✅</div>
                            <h3>Acceptées</h3>
                            <p className="stat">{stats.acceptees}</p>
                            <p className="stat-detail">Félicitations !</p>
                        </div>

                        <div className="dashboard-card stats-card rejected">
                            <div className="stat-icon">❌</div>
                            <h3>Refusées</h3>
                            <p className="stat">{stats.refusees}</p>
                            <p className="stat-detail">Continuez vos efforts</p>
                        </div>
                    </div>

                    {/* Actions rapides */}
                    <div className="dashboard-section">
                        <h2>Actions Rapides</h2>
                        <div className="dashboard-grid actions-grid">
                            <div className="dashboard-card action-card">
                                <h3>🔍 Rechercher des Stages</h3>
                                <p>Découvrez de nouvelles opportunités de stage</p>
                                <Link to="/stages" className="btn btn-primary">
                                    Explorer les offres
                                </Link>
                            </div>

                            <div className="dashboard-card action-card">
                                <h3>📄 Mes Candidatures</h3>
                                <p>Suivez l'état de vos candidatures</p>
                                <Link to="/mes-candidatures" className="btn btn-secondary">
                                    Gérer mes candidatures
                                </Link>
                            </div>

                            <div className="dashboard-card action-card">
                                <h3>👤 Mon Profil</h3>
                                <p>Mettez à jour vos informations</p>
                                <Link to="/profile" className="btn btn-outline">
                                    Modifier le profil
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Candidatures récentes */}
                    {candidatures.length > 0 && (
                        <div className="dashboard-section">
                            <h2>Mes Dernières Candidatures</h2>
                            <div className="recent-candidatures">
                                {candidatures.slice(0, 3).map(candidature => (
                                    <div key={candidature.id} className="candidature-card">
                                        <div className="candidature-info">
                                            <h4>{candidature.stage?.titre || 'Stage non disponible'}</h4>
                                            <p className="candidature-entreprise">
                                                {candidature.stage?.entreprise?.nom || 'Entreprise non spécifiée'}
                                            </p>
                                            <p className="candidature-date">
                                                Candidature envoyée le {new Date(candidature.createdAt).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                        <div className="candidature-status">
                                            <span className={`status-badge ${getStatutBadge(candidature.status).class}`}>
                                                <span className="status-icon">{getStatutBadge(candidature.status).icon}</span>
                                                {getStatutBadge(candidature.status).text}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {candidatures.length > 3 && (
                                <Link to="/mes-candidatures" className="view-all-link">
                                    Voir toutes mes candidatures ({candidatures.length})
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Nouveaux stages recommandés */}
                    {recentStages.length > 0 && (
                        <div className="dashboard-section">
                            <h2>Nouvelles Opportunités</h2>
                            <div className="recent-stages">
                                {recentStages.map(stage => (
                                    <div key={stage.id} className="stage-preview-card">
                                        <h4>{stage.titre}</h4>
                                        <p className="stage-entreprise">{stage.entreprise?.nom || stage.Entreprise?.nom || 'Entreprise non spécifiée'}</p>
                                        <p className="stage-location">{stage.lieu}</p>
                                        <p className="stage-duration">
                                            {calculateDuration(stage.dateDebut, stage.dateFin)}
                                        </p>
                                        <Link to={`/stages/${stage.id}`} className="btn btn-sm btn-primary">
                                            Voir les détails
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <Link to="/stages" className="view-all-link">
                                Voir toutes les offres de stage
                            </Link>
                        </div>
                    )}

                    {/* Message d'encouragement */}
                    {candidatures.length === 0 && (
                        <div className="dashboard-section welcome-section">
                            <div className="welcome-card">
                                <h2>Commencez votre recherche de stage !</h2>
                                <p>
                                    Vous n'avez pas encore postulé pour des stages. 
                                    Explorez nos offres et trouvez le stage parfait pour votre formation.
                                </p>
                                <Link to="/stages" className="btn btn-primary btn-large">
                                    Découvrir les offres de stage
                                </Link>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;