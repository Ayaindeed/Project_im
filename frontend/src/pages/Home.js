import React from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {
  const history = useHistory();

  const handleRoleSelect = (role) => {
    history.push('/login', { selectedRole: role });
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Bienvenue sur InternMatch</h1>
        <p className="hero-text">
          La plateforme qui connecte les étudiants, les entreprises et les administrateurs 
          pour une gestion simplifiée des stages.
        </p>
      </div>

      <div className="cards-container">
        <div className="role-card" onClick={() => handleRoleSelect('etudiant')}>
          <div className="role-icon">👨‍🎓</div>
          <h3>Étudiant</h3>
          <p>Trouvez le stage parfait et gérez vos candidatures facilement</p>
          <button className="btn btn-primary">Commencer</button>
        </div>

        <div className="role-card" onClick={() => handleRoleSelect('entreprise')}>
          <div className="role-icon">🏢</div>
          <h3>Entreprise</h3>
          <p>Publiez des offres et trouvez les meilleurs talents</p>
          <button className="btn btn-primary">Commencer</button>
        </div>

        <div className="role-card" onClick={() => handleRoleSelect('admin')}>
          <div className="role-icon">⚙️</div>
          <h3>Administrateur</h3>
          <p>Supervisez et gérez l'ensemble du processus de stage</p>
          <button className="btn btn-primary">Commencer</button>
        </div>
      </div>
    </div>
  );
};

export default Home;