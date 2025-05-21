import React, { useEffect, useState } from 'react';
import { getAllStages } from '../services/api';

const InternshipList = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getAllStages();
                setInternships(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApply = async (stageId) => {
        try {
            await postulerStage({ stageId });
            // Show success message
        } catch (err) {
            // Handle error
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="error">Erreur : {error}</div>;

    return (
        <div>
            <h1>Stages disponibles</h1>
            {internships.length === 0 && <div>Aucun stage disponible.</div>}
            {internships.map(internship => (
                <div className="card" key={internship.id}>
                    <h2>{internship.titre}</h2>
                    <p>{internship.description}</p>
                    <p><strong>Début :</strong> {internship.dateDebut ? new Date(internship.dateDebut).toLocaleDateString() : '-'}</p>
                    <p><strong>Fin :</strong> {internship.dateFin ? new Date(internship.dateFin).toLocaleDateString() : '-'}</p>
                    <p><strong>Status :</strong> {internship.status}</p>
                    <button onClick={() => handleApply(internship.id)}>Postuler</button>
                </div>
            ))}
        </div>
    );
};

export default InternshipList;