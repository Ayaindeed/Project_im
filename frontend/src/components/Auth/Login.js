import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { loginUser } from '../../services/api';
import leftImage from '../../assets/im1.png';
import rightImage from '../../assets/im2.png';

const Login = () => {
  const [form, setForm] = useState({ email: '', motdepasse: '' });
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Login attempt:', form); // Debug log

      const response = await loginUser(form);
      console.log('Login response:', response); // Debug log

      if (response.data) {
        // Store token
        localStorage.setItem('token', response.data.accessToken);
        
        // Store user data including role
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          nom: response.data.nom,
          email: response.data.email,
          role: response.data.role,
        }));

        // Add role-based redirection
        const role = response.data.role;
        if (role === 'entreprise') {
          history.push('/entreprise-dashboard');
        } else if (role === 'etudiant') {
          history.push('/dashboard');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || "Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-images">
          <div className="image-left">
            <img src={leftImage} alt="Welcome" />
          </div>
          <div className="image-right">
            <img src={rightImage} alt="Features" />
          </div>
        </div>
        
        <div className="login-box">
          <div className="login-form-container">
            <h2>Bienvenue</h2>
            <p className="login-subtitle">
              Connectez-vous pour continuer
            </p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  value={form.motdepasse}
                  onChange={(e) => setForm({...form, motdepasse: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Se connecter
              </button>
            </form>

            <div className="login-footer">
              <p>Pas encore de compte ?</p>
              <Link to="/register" className="btn btn-secondary btn-block">
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;