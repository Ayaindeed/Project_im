import React from 'react';
import { Link, useHistory } from 'react-router-dom';

const NavBar = () => {
    const history = useHistory();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        history.push('/');
    };

    return (
        <nav style={{
            background: '#2563eb',
            padding: '16px',
            marginBottom: '32px',
            borderRadius: '0 0 12px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', marginRight: 20 }}>Accueil</Link>
                {token && <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none', marginRight: 20 }}>Dashboard</Link>}
                <Link to="/internships" style={{ color: '#fff', textDecoration: 'none', marginRight: 20 }}>Stages</Link>
                {role === 'etudiant' && (
                    <>
                        <Link to="/submit-stage" style={{ color: '#fff', textDecoration: 'none', marginRight: 20 }}>Soumettre un stage</Link>
                        <Link to="/my-candidatures" style={{ color: '#fff', textDecoration: 'none', marginRight: 20 }}>Mes candidatures</Link>
                    </>
                )}
                {role === 'entreprise' && (
                    <Link to="/entreprise-candidatures" style={{ color: '#fff', textDecoration: 'none', marginRight: 20 }}>Candidatures reçues</Link>
                )}
                {role === 'admin' && (
                    <>
                        <Link to="/admin-users" style={{ color: '#fff', textDecoration: 'none', marginRight: 20 }}>Utilisateurs</Link>
                        <Link to="/admin-stats" style={{ color: '#fff', textDecoration: 'none', marginRight: 20 }}>Statistiques</Link>
                    </>
                )}
            </div>
            <div>
                {!token && (
                    <>
                        <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: 20 }}>Login</Link>
                        <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
                    </>
                )}
                {token && (
                    <button onClick={handleLogout} style={{ background: '#fff', color: '#2563eb', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
                )}
            </div>
        </nav>
    );
};

export default NavBar;