import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { registerAdmin } from '../../services/authService';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        motdepasse: ''
    });
    const [error, setError] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerAdmin(formData);
            history.push('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription");
        }
    };

    return (
        <div className="admin-register-wrapper">
            <div className="admin-register-container">
                <div className="admin-register-box">
                    <h2>Inscription Administrateur</h2>
                    {error && <div className="error-message">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nom</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.nom}
                                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Prénom</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.prenom}
                                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.motdepasse}
                                onChange={(e) => setFormData({...formData, motdepasse: e.target.value})}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Créer le compte
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;