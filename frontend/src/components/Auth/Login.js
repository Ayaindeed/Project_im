import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { loginUser } from '../../services/authService';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        motdepasse: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await loginUser(credentials);
            
            // Attendre que l'événement userLogin soit traité par AppRouter
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Déterminer la route de destination selon le rôle
            let dashboardRoute;
            if (response.user.role === 'admin') {
                dashboardRoute = '/admin-dashboard';
            } else if (response.user.role === 'entreprise') {
                dashboardRoute = '/entreprise-dashboard';
            } else {
                dashboardRoute = '/dashboard';
            }
            
            // Utiliser React Router pour une navigation fluide
            history.push(dashboardRoute);
            
            // Garder le loading actif pendant la transition
            setTimeout(() => setLoading(false), 100);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion');
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-box">
                    <div className="login-form-container">
                        <div className="login-header">
                            <h1 className="welcome-title">BIENVENUE À</h1>
                            <div className="app-logo">
                                <span className="logo-text">InternMatch</span>
                            </div>
                        </div>

                        <div className="login-form-wrapper">
                            <h2 className="login-title">Connexion</h2>
                            
                            {error && <div className="error-message">{error}</div>}

                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Adresse email"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Mot de passe"
                                        value={credentials.motdepasse}
                                        onChange={(e) => setCredentials({...credentials, motdepasse: e.target.value})}
                                        required
                                    />
                                </div>

                                <button type="submit" className={`btn btn-primary btn-block login-submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                                    {loading ? '' : 'Se connecter'}
                                </button>
                            </form>

                            <div className="login-links">
                                <Link to="/forgot-password" className="forgot-password-link">
                                    Mot de passe oublié ?
                                </Link>
                            </div>

                            <div className="login-footer">
                                <p className="signup-text">Pas encore de compte ?</p>
                                <Link to="/register" className="btn btn-secondary btn-block signup-btn">
                                    Créer un compte
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;