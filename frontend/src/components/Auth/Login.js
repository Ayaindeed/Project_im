import React, { useState } from 'react';
import { loginUser } from '../../services/api';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', motdepasse: '' });
  const [error, setError] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await loginUser(form);
      // Store token and user info
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        nom: response.nom,
        prenom: response.prenom,
        email: response.email,
        role: response.role
      }));
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="motdepasse" type="password" placeholder="Mot de passe" value={form.motdepasse} onChange={handleChange} required />
      <button type="submit">Connexion</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default Login;