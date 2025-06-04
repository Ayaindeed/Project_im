import React, { useEffect, useState } from 'react';
import { getStageStats } from '../services/stageService';

const AdminStats = () => {
    const [stats, setStats] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);    useEffect(() => {
        const fetchStats = () => {
            setIsLoading(true);
            getStageStats()
                .then(setStats)
                .catch(err => setError(err.response?.data?.error || 'Erreur de chargement'))
                .finally(() => setIsLoading(false));
        };

        fetchStats();

        // Écouter les événements de candidature traitée pour mettre à jour les stats
        const handleCandidatureUpdate = () => {
            console.log('AdminStats: Candidature traitée - mise à jour des stats');
            setTimeout(() => {
                fetchStats();
            }, 1000);
        };

        // Écouter les événements de mise à jour des stats
        const handleStatsUpdate = () => {
            console.log('AdminStats: Stats mises à jour');
            fetchStats();
        };

        window.addEventListener('candidatureTraitee', handleCandidatureUpdate);
        window.addEventListener('statsUpdated', handleStatsUpdate);

        return () => {
            window.removeEventListener('candidatureTraitee', handleCandidatureUpdate);
            window.removeEventListener('statsUpdated', handleStatsUpdate);
        };
    }, []);    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Statistiques des stages et candidatures</h2>
            {error && <div className="error">{error}</div>}
            
            {/* Statistiques des stages */}
            <div className="stats-section">
                <h3>Stages</h3>
                <div className="stats-grid">
                    <div className="card">
                        <div><b>Total:</b> {stats.total || 0}</div>
                    </div>
                    <div className="card">
                        <div><b>Disponibles:</b> {stats.disponible || 0}</div>
                    </div>
                    <div className="card">
                        <div><b>En cours:</b> {stats.enCours || 0}</div>
                    </div>
                    <div className="card">
                        <div><b>Terminés:</b> {stats.termine || 0}</div>
                    </div>
                </div>
            </div>

            {/* Statistiques des candidatures */}
            <div className="stats-section">
                <h3>Candidatures</h3>
                <div className="stats-grid">
                    <div className="card">
                        <div><b>Total:</b> {stats.totalCandidatures || 0}</div>
                    </div>
                    <div className="card">
                        <div><b>En attente:</b> {stats.candidaturesParStatut?.en_attente || 0}</div>
                    </div>
                    <div className="card">
                        <div><b>Acceptées:</b> {stats.candidaturesParStatut?.accepté || 0}</div>
                    </div>
                    <div className="card">
                        <div><b>Refusées:</b> {stats.candidaturesParStatut?.refusé || 0}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;