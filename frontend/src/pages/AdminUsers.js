import React, { useEffect, useState } from 'react';
import { getAllUsers, toggleUserActivation } from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
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
      await toggleUserActivation(id);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du changement de statut");
    }
  };

  return (
    <div>
      <h2>Utilisateurs</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.nom}</td>
                <td>{u.prenom}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.actif ? 'Actif' : 'Inactif'}</td>
                <td>
                  <button onClick={() => handleToggle(u.id)}>
                    {u.actif ? 'Désactiver' : 'Activer'}
                  </button>
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