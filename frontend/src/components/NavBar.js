import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Logo from './Logo/Logo';

const NavBar = ({ isAuthenticated, user }) => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className={`navbar ${isAuthenticated ? 'authenticated' : ''}`}>
      <div className="nav-content">
        <div className="nav-left">
          <Link to="/" className="logo-link">
            <Logo width="120px" />
          </Link>
        </div>

        {isAuthenticated ? (
          <div className="nav-menu">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/stages" className="nav-link">Stages</Link>
            {user?.role === 'etudiant' && (
              <Link to="/mes-candidatures" className="nav-link">Mes candidatures</Link>
            )}
            {user?.role === 'entreprise' && (
              <>
                <Link to="/mes-stages" className="nav-link">Mes stages</Link>
                <Link to="/entreprise-candidatures" className="nav-link">Candidatures</Link>
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <Link to="/admin-users" className="nav-link">Utilisateurs</Link>
                <Link to="/admin-stats" className="nav-link">Statistiques</Link>
              </>
            )}
            <button onClick={handleLogout} className="btn btn-secondary">
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="nav-right">
            <Link to="/register" className="btn btn-secondary">S'inscrire</Link>
            <Link to="/login" className="btn btn-primary">Se connecter</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;