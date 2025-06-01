import React from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../components/Footer/Footer';

const Home = () => {
  const history = useHistory();

  const handleRoleSelect = (role) => {
    if (role === 'admin') {
      history.push('/admin-register');
    } else {
      history.push('/login', { selectedRole: role });
    }
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="hero-section">
          <h1>Bienvenue sur InternMatch</h1>
          <p className="hero-text">
            La plateforme qui connecte les étudiants, les entreprises et les administrateurs 
            pour une gestion simplifiée des stages.
          </p>
        </div>        <div className="cards-container">
          <div className="role-card" onClick={() => handleRoleSelect('etudiant')}>
            <div className="role-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <h3>Étudiant</h3>
            <p>Trouvez le stage parfait et gérez vos candidatures facilement</p>
            <button className="btn btn-primary">Commencer</button>
          </div>

          <div className="role-card" onClick={() => handleRoleSelect('entreprise')}>
            <div className="role-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"/>
                <path d="M5 21V7l8-4v18"/>
                <path d="M19 21V11l-6-4"/>
                <path d="M9 9v.01"/>
                <path d="M9 12v.01"/>
                <path d="M9 15v.01"/>
                <path d="M9 18v.01"/>
              </svg>
            </div>
            <h3>Entreprise</h3>
            <p>Publiez des offres et trouvez les meilleurs talents</p>
            <button className="btn btn-primary">Commencer</button>
          </div>

          <div className="role-card" onClick={() => handleRoleSelect('admin')}>
            <div className="role-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6"/>
                <path d="M21 12h-6m-6 0H3"/>
                <path d="M19.07 4.93l-4.24 4.24m-5.66 0L4.93 4.93"/>
                <path d="M19.07 19.07l-4.24-4.24m-5.66 0L4.93 19.07"/>
              </svg>
            </div>
            <h3>Administrateur</h3>
            <p>Supervisez et gérez l'ensemble du processus de stage</p>
            <button className="btn btn-primary">Commencer</button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;