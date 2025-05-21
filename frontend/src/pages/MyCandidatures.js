import React, { useEffect, useState } from 'react';
import { getEtudiantCandidatures } from '../services/api';
const MyCandidatures = () => {
    const [candidatures, setCandidatures] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        getEtudiantCandidatures()
            .then(setCandidatures)
            .catch(err => setError(err.response?.data?.error || 'Erreur de chargement'));
    }, []);

    return (
        <div>
            <h2>Mes candidatures</h2>
            {error && <div className="error">{error}</div>}
            {candidatures.map(c => (
                <div className="card" key={c.id}>
                    <div><b>Titre:</b> {c.Stage?.titre}</div>
                    <div><b>Status:</b> {c.status}</div>
                    <div><b>Commentaire:</b> {c.commentaireEntreprise}</div>
                </div>
            ))}
        </div>
    );
};

export default MyCandidatures;