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
      <h2>Gestion des Utilisateurs</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="loading">Chargement...</div>
      ) : (
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Date d'inscription</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <strong>{u.nom} {u.prenom}</strong>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge role-${u.role}`}>
                    {u.role === 'admin' ? 'Administrateur' : 
                     u.role === 'entreprise' ? 'Entreprise' : 'Étudiant'}
                  </span>
                </td>
                <td>
                  <span className="registration-date">
                    {new Date(u.dateInscription).toLocaleDateString()}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${u.actif ? 'status-active' : 'status-inactive'}`}>
                    {u.actif ? 'Actif' : 'Inactif'}
                  </span>
                </td>                <td>
                  <button 
                    onClick={() => handleToggle(u.id)} 
                    className={`status-toggle ${u.actif ? 'deactivate' : 'activate'}`}
                  >
                    {u.actif ? 'Désactiver' : 'Activer'}
                  </button>
                  <Link to={`/admin-user/${u.id}`} className="details-button">
                    Détails
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;