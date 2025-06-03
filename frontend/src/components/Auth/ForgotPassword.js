import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setMessage('Si cet email existe dans notre système, vous recevrez un lien de réinitialisation.');
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-box forgot-password-box">
                    <div className="login-form-container">
                        <div className="login-header">
                            <h1 className="welcome-title">RÉCUPÉRATION</h1>
                            <div className="app-logo">
                                <span className="logo-text">Mot de passe</span>
                            </div>
                        </div>

                        <div className="login-form-wrapper">
                            <h2 className="login-title">Réinitialiser votre mot de passe</h2>
                            <p className="forgot-description">
                                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                            </p>
                            
                            {message && (
                                <div className="success-message">{message}</div>
                            )}

                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Adresse email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className={`btn btn-primary btn-block login-submit-btn ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? '' : 'Envoyer le lien'}
                                </button>
                            </form>

                            <div className="login-footer">
                                <Link to="/login" className="back-to-login-link">
                                    ← Retour à la connexion
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
