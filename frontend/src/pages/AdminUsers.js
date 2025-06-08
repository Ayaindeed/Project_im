import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserStats, toggleUserStatus } from '../services/userService';
import '../styles/AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUserStats();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = async (id) => {
    try {
      await toggleUserStatus(id);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du changement de statut");
    }
  };
  return (
    <div className="admin-users-container">
      <div className="section-header">
        <div className="section-title">
          <h2>Gestion des comptes utilisateurs</h2>
          <p className="section-subtitle">Gérez les utilisateurs et leurs permissions</p>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="loading">Chargement...</div>
      ) : (
        <div className="users-table-container">
          <div className="table-wrapper">
            <table className="enhanced-table">
              <thead>
                <tr>
                  <th>
                    <div className="th-content">
                      <i className="fas fa-user"></i>
                      Utilisateur
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <i className="fas fa-envelope"></i>
                      Email
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <i className="fas fa-tag"></i>
                      Rôle
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <i className="fas fa-calendar"></i>
                      Date d'inscription
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <i className="fas fa-toggle-on"></i>
                      Statut
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <i className="fas fa-cogs"></i>
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="table-row">
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.nom?.[0]}{user.prenom?.[0]}
                        </div>
                        <div className="user-details">
                          <span className="user-name">{user.nom} {user.prenom}</span>
                          <span className="user-id">ID: {user.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="user-email">{user.email}</span>
                    </td>
                    <td>
                      <span className={`role-badge enhanced-badge role-${user.role}`}>
                        <i className={`fas ${user.role === 'admin' ? 'fa-crown' : 
                          user.role === 'entreprise' ? 'fa-building' : 'fa-graduation-cap'}`}></i>
                        {user.role === 'admin' ? 'Admin' : 
                        user.role === 'entreprise' ? 'Entreprise' : 'Étudiant'}
                      </span>
                    </td>                    <td>
                      <span className="registration-date">
                        {new Date(user.dateInscription).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge enhanced-status ${user.actif ? 'active' : 'inactive'}`}>
                        <div className="status-indicator"></div>
                        {user.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleToggle(user.id)}
                          className={`action-btn ${user.actif ? 'btn-danger' : 'btn-success'}`}
                          title={user.actif ? 'Désactiver l\'utilisateur' : 'Activer l\'utilisateur'}
                        >
                          <i className={`fas ${user.actif ? 'fa-ban' : 'fa-check'}`}></i>
                          {user.actif ? 'Désactiver' : 'Activer'}
                        </button>
                        <Link 
                          to={`/admin-user/${user.id}`} 
                          className="action-btn btn-info"
                          title="Voir les détails de l'utilisateur"
                        >
                          <i className="fas fa-eye"></i>
                          Détails
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;