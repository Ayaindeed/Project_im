import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './GoogleAuthSuccess.css';

const GoogleAuthSuccess = () => {
    const history = useHistory();
    const location = useLocation();
    const [error, setError] = useState('');

    useEffect(() => {
        const handleGoogleAuthSuccess = () => {
            try {
                // Parse URL parameters
                const urlParams = new URLSearchParams(location.search);
                const token = urlParams.get('token');
                const userDataParam = urlParams.get('user');
                const errorParam = urlParams.get('error');

                if (errorParam) {
                    setError(getErrorMessage(errorParam));
                    setTimeout(() => {
                        history.push('/login');
                    }, 3000);
                    return;
                }

                if (token && userDataParam) {
                    try {
                        const userData = JSON.parse(decodeURIComponent(userDataParam));
                        
                        // Store authentication data
                        localStorage.setItem('token', token);
                        localStorage.setItem('user', JSON.stringify(userData));
                        
                        // Dispatch login event
                        const loginEvent = new CustomEvent('userLogin', { 
                            detail: { user: userData } 
                        });
                        window.dispatchEvent(loginEvent);
                        
                        // Redirect to appropriate dashboard
                        let dashboardRoute;
                        if (userData.role === 'admin') {
                            dashboardRoute = '/admin-dashboard';
                        } else if (userData.role === 'entreprise') {
                            dashboardRoute = '/entreprise-dashboard';
                        } else {
                            dashboardRoute = '/dashboard';
                        }
                        
                        history.push(dashboardRoute);
                    } catch (parseError) {
                        console.error('Error parsing user data:', parseError);
                        setError('Erreur lors du traitement des données utilisateur');
                        setTimeout(() => {
                            history.push('/login');
                        }, 3000);
                    }
                } else {
                    setError('Données d\'authentification manquantes');
                    setTimeout(() => {
                        history.push('/login');
                    }, 3000);
                }
            } catch (error) {
                console.error('Google auth success error:', error);
                setError('Erreur lors de l\'authentification');
                setTimeout(() => {
                    history.push('/login');
                }, 3000);
            }
        };

        handleGoogleAuthSuccess();
    }, [history, location]);

    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'authentication_failed':
                return 'Échec de l\'authentification Google';
            case 'google_auth_failed':
                return 'Erreur lors de l\'authentification Google';
            case 'server_error':
                return 'Erreur serveur lors de l\'authentification';
            default:
                return 'Erreur d\'authentification inconnue';
        }
    };

    return (
        <div className="google-auth-success-wrapper">
            <div className="google-auth-success-container">
                <div className="google-auth-success-box">
                    {error ? (
                        <div className="error-content">
                            <div className="error-icon">⚠️</div>
                            <h2>Erreur d'authentification</h2>
                            <p>{error}</p>
                            <p>Redirection vers la page de connexion...</p>
                        </div>
                    ) : (
                        <div className="success-content">
                            <div className="loading-spinner"></div>
                            <h2>Authentification en cours...</h2>
                            <p>Veuillez patienter, vous allez être redirigé.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoogleAuthSuccess;
