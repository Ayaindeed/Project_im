import React, { useEffect, useState } from 'react';
import { getEntrepriseStages, getStageCandidatures, traiterCandidature } from '../services/api';

const statusLabels = {
  en_attente: 'En attente',
  validé: 'Validé',
  refusé: 'Refusé'
};

const EntrepriseCandidatures = () => {
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add to all pages

  useEffect(() => {
    const fetchStages = async () => {
      setIsLoading(true);
      try {
        const data = await getEntrepriseStages();
        setStages(data);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors du chargement des stages");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStages();
  }, []);

  const handleStageSelect = async (stageId) => {
    setSelectedStage(stageId);
    setCandidatures([]);
    setIsLoading(true);
    try {
      const data = await getStageCandidatures(stageId);
      setCandidatures(data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des candidatures");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTraiter = async (candidatureId, status) => {
    setIsLoading(true);
    try {
      await traiterCandidature({ candidatureId, status });
      // Refresh candidatures
      if (selectedStage) handleStageSelect(selectedStage);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du traitement");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmTraiter = (candidatureId, status) => {
    if(window.confirm(`Confirmer ${status} la candidature ?`)) {
      handleTraiter(candidatureId, status);
    }
  };

  return (
    <div>
      <h2>Mes Stages</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <select onChange={e => handleStageSelect(e.target.value)} value={selectedStage || ''}>
        <option value="">-- Sélectionner un stage --</option>
        {stages.map(stage => (
          <option key={stage.id} value={stage.id}>{stage.titre}</option>
        ))}
      </select>
      {isLoading && <div>Loading...</div>}
      {candidatures.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidatures.map(c => (
              <tr key={c.id}>
                <td>{c.etudiantNom} {c.etudiantPrenom}</td>
                <td>{statusLabels[c.status] || c.status}</td>
                <td>
                  {c.status === 'en_attente' && (
                    <>
                      <button onClick={() => confirmTraiter(c.id, 'validé')}>Valider</button>
                      <button onClick={() => confirmTraiter(c.id, 'refusé')}>Refuser</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EntrepriseCandidatures;