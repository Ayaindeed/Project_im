import React, { useState } from 'react';
import { registerUser } from '../../services/api';
import { useHistory } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    motdepasse: '',
    role: 'etudiant',
    niveau: '',
    filiere: '',
    secteur: '',
    adresse: ''
  });
  const [error, setError] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setForm({ ...form, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let data = {
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      motdepasse: form.motdepasse,
      role: form.role
    };
    if (form.role === 'etudiant') {
      data.niveau = form.niveau;
      data.filiere = form.filiere;
    }
    if (form.role === 'entreprise') {
      data.secteur = form.secteur;
      data.adresse = form.adresse;
      // Ajoute d'autres champs requis si besoin
    }
    try {
      await registerUser(data);
      history.push('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required />
      <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="motdepasse" type="password" placeholder="Mot de passe" value={form.motdepasse} onChange={handleChange} required />
      <select name="role" value={form.role} onChange={handleRoleChange}>
        <option value="etudiant">Étudiant</option>
        <option value="entreprise">Entreprise</option>
      </select>
      {form.role === 'etudiant' && (
        <>
          <input name="niveau" placeholder="Niveau" value={form.niveau} onChange={handleChange} required />
          <input name="filiere" placeholder="Filière" value={form.filiere} onChange={handleChange} required />
        </>
      )}
      {form.role === 'entreprise' && (
        <>
          <input name="secteur" placeholder="Secteur" value={form.secteur} onChange={handleChange} required />
          <input name="adresse" placeholder="Adresse" value={form.adresse} onChange={handleChange} required />
          {/* Ajoute d'autres champs requis ici si besoin */}
        </>
      )}
      <button type="submit">Inscription</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default Register;