import React, { useState, useEffect } from 'react';
import { getUserStats } from '../services/userService';
import { getAllStages } from '../services/stageService';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [stages, setStages] = useState([]);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchStages = async () => {
            setIsLoading(true);
            try {
                const data = await getAllStages();
                setStages(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStages();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Bienvenue {user.prenom} {user.nom} sur la plateforme de gestion des stages !</p>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {isLoading ? (
                <div className="loading">Chargement...</div>
            ) : (
                <div className="stages-list">
                    {stages.map(stage => (
                        <div key={stage.id} className="stage-card">
                            <h3>{stage.titre}</h3>
                            {/* Add other stage details as needed */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;