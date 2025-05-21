import React, { useEffect, useState } from 'react';
import { getStageStats } from '../services/api';

const AdminStats = () => {
    const [stats, setStats] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getStageStats()
            .then(setStats)
            .catch(err => setError(err.response?.data?.error || 'Erreur de chargement'))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Statistiques des stages</h2>
            {error && <div className="error">{error}</div>}
            {stats.map(s => (
                <div className="card" key={s.status}>
                    <div><b>Status:</b> {s.status}</div>
                    <div><b>Nombre:</b> {s.count}</div>
                </div>
            ))}
        </div>
    );
};

export default AdminStats;