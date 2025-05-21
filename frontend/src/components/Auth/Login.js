import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom'; // Add Link import
import { loginUser } from '../../services/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', motdepasse: '' });
  const [error, setError] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await loginUser(form);
      const userData = response.data;
      
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        role: userData.role
      }));
      
      if (userData.accessToken) {
        localStorage.setItem('token', userData.accessToken);
      }

      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || "Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Connexion à InternMatch</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              className="form-control"
              name="email" 
              type="email" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input 
              className="form-control"
              name="motdepasse" 
              type="password" 
              value={form.motdepasse} 
              onChange={handleChange} 
              required 
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block">
            Connexion
          </button>

          <div className="auth-footer">
            <p>Pas encore membre ?</p>
            <Link to="/register" className="btn btn-secondary">
              Créer un compte
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;