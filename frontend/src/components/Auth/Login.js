import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import leftImage from '../../assets/im1.png';
import rightImage from '../../assets/im2.png';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        motdepasse: ''
    });
    const [error, setError] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(credentials);
            
            // Redirect based on user role
            if (response.user.role === 'admin') {
                history.push('/admin-dashboard');
            } else if (response.user.role === 'entreprise') {
                history.push('/entreprise-dashboard');
            } else {
                history.push('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion');
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
                              value={credentials.email}
                              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Mot de passe</label>
                            <input
                              type="password"
                              className="form-control"
                              value={credentials.motdepasse}
                              onChange={(e) => setCredentials({...credentials, motdepasse: e.target.value})}
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