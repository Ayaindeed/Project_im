import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Logo from '../Logo/Logo';

const NavBar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const history = useHistory();

    // Fonction pour rafraîchir l'état d'authentification
    const refreshAuthState = () => {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));
        if (token && userData) {
            setIsAuthenticated(true);
            setUser(userData);
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
    };  

    // Initialiser l'état d'authentification au chargement
    useEffect(() => {
        refreshAuthState();
        
        // Écouter les événements de connexion
        const handleLogin = () => refreshAuthState();
        window.addEventListener('userLogin', handleLogin);
        
        // Nettoyer les écouteurs d'événements
        return () => {
            window.removeEventListener('userLogin', handleLogin);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        
        // Dispatch un événement de déconnexion
        const logoutEvent = new CustomEvent('userLogout');
        window.dispatchEvent(logoutEvent);
        
        history.push('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-content">
                <div className="nav-left">
                    <Link to="/" className="logo-link">
                        <Logo width="120px" />
                    </Link>
                </div>

                <div className="nav-right">
                    {isAuthenticated ? (
                        <div className="nav-menu">                            {user?.role === 'entreprise' && (
                                <>
                                    <Link to="/entreprise-dashboard" className="nav-link">Dashboard</Link>
                                    <Link to="/entreprise-stages" className="nav-link">Mes Stages</Link>
                                    <Link to="/entreprise-candidatures" className="nav-link">Demandes Reçues</Link>
                                </>
                            )}{user?.role === 'etudiant' && (
                                <>
                                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                    <Link to="/stages" className="nav-link">Stages</Link>
                                    <Link to="/mes-candidatures" className="nav-link">Mes candidatures</Link>
                                </>
                            )}
                            
                            {user?.role === 'admin' && (
                                <>
                                    <Link to="/admin-dashboard" className="nav-link">Tableau de bord</Link>
                                    <Link to="/admin-users" className="nav-link">Utilisateurs</Link>
                                </>
                            )}
                            
                            <button onClick={handleLogout} className="auth-button">
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/register" className="auth-button secondary">S'inscrire</Link>
                            <Link to="/login" className="auth-button primary">Se connecter</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;