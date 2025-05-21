import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { registerUser } from '../../services/api';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      history.push('/');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <h2>Créer un compte InternMatch</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input 
                className="form-control"
                name="nom"
                value={form.nom}
                onChange={e => setForm({...form, nom: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input 
                className="form-control"
                name="prenom"
                value={form.prenom}
                onChange={e => setForm({...form, prenom: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              className="form-control"
              type="email"
              name="email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input 
              className="form-control"
              type="password"
              name="motdepasse"
              value={form.motdepasse}
              onChange={e => setForm({...form, motdepasse: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type de compte</label>
            <select 
              className="form-control"
              value={form.role}
              onChange={e => setForm({...form, role: e.target.value})}
            >
              <option value="etudiant">Étudiant</option>
              <option value="entreprise">Entreprise</option>
            </select>
          </div>

          {form.role === 'etudiant' && (
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Niveau</label>
                <input 
                  className="form-control"
                  name="niveau"
                  value={form.niveau}
                  onChange={e => setForm({...form, niveau: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Filière</label>
                <input 
                  className="form-control"
                  name="filiere"
                  value={form.filiere}
                  onChange={e => setForm({...form, filiere: e.target.value})}
                  required
                />
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block">
            S'inscrire
          </button>

          <div className="auth-footer">
            <p>Déjà membre ?</p>
            <Link to="/" className="btn btn-secondary">
              Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;