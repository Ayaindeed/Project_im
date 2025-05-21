import React, { useState } from 'react';
import { createStage } from '../services/api';
import { useHistory } from 'react-router-dom';

const SubmitStage = () => {
  const [form, setForm] = useState({
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
  });
  const [error, setError] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStage(form);
      history.push('/mes-stages');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission');
    }
  };

  return (
    <div className="submit-stage">
      <h2>Soumettre un stage</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre</label>
          <input 
            name="titre" 
            value={form.titre} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Description</label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Date de début</label>
          <input 
            type="date" 
            name="dateDebut" 
            value={form.dateDebut} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Date de fin</label>
          <input 
            type="date" 
            name="dateFin" 
            value={form.dateFin} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
};

export default SubmitStage;