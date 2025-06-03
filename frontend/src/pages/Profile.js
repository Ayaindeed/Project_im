import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import '../styles/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState('');    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        // Champs spécifiques aux étudiants
        niveau: '',
        filiere: '',
        cv: null,
        lettreMotivation: null
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setUser(userData);            setFormData({
                nom: userData.nom || '',
                prenom: userData.prenom || '',
                email: userData.email || '',
                niveau: userData.niveau || '',
                filiere: userData.filiere || '',
                cv: null,
                lettreMotivation: null
            });
        }
        setLoading(false);
    }, []);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await authService.updateProfile(formDataToSend);
            
            // Mettre à jour le localStorage avec les nouvelles données
            const updatedUser = { ...user, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            setMessage('Profil mis à jour avec succès !');
            setEditMode(false);
            
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Erreur lors de la mise à jour du profil: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    <span className="avatar-icon">👤</span>
                </div>
                <div className="profile-title">
                    <h1>Mon Profil</h1>
                    <p>Gérez vos informations personnelles</p>
                </div>
                <button 
                    className={`edit-toggle-btn ${editMode ? 'save' : 'edit'}`}
                    onClick={() => setEditMode(!editMode)}
                >
                    {editMode ? '❌ Annuler' : '✏️ Modifier'}
                </button>
            </div>

            {message && (
                <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <div className="profile-content">
                {!editMode ? (
                    <div className="profile-view">                        <div className="info-section">
                            <h3>📋 Informations Personnelles</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Nom</label>
                                    <span>{user?.nom || 'Non renseigné'}</span>
                                </div>
                                <div className="info-item">
                                    <label>Prénom</label>
                                    <span>{user?.prenom || 'Non renseigné'}</span>
                                </div>
                                <div className="info-item">
                                    <label>Email</label>
                                    <span>{user?.email}</span>
                                </div>
                            </div>
                        </div>

                        {user?.role === 'etudiant' && (
                            <div className="info-section">
                                <h3>🎓 Informations Académiques</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Niveau</label>
                                        <span>{user?.niveau || 'Non renseigné'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Filière</label>
                                        <span>{user?.filiere || 'Non renseignée'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>CV</label>
                                        <span>{user?.cv ? 'Téléchargé' : 'Non téléchargé'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Lettre de motivation</label>
                                        <span>{user?.lettreMotivation ? 'Téléchargée' : 'Non téléchargée'}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="info-section">
                            <h3>🎯 Informations de Compte</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Rôle</label>
                                    <span className="role-badge">{user?.role}</span>
                                </div>
                                <div className="info-item">
                                    <label>Date de création</label>
                                    <span>
                                        {user?.createdAt 
                                            ? new Date(user.createdAt).toLocaleDateString('fr-FR')
                                            : 'Non disponible'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="profile-edit-form">
                        <div className="form-section">
                            <h3>📝 Modifier les Informations</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="nom">Nom *</label>
                                    <input
                                        type="text"
                                        id="nom"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="prenom">Prénom *</label>
                                    <input
                                        type="text"
                                        id="prenom"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                
                                {user?.role === 'etudiant' && (
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="niveau">Niveau *</label>
                                            <input
                                                type="text"
                                                id="niveau"
                                                name="niveau"
                                                value={formData.niveau}
                                                onChange={handleInputChange}
                                                placeholder="Ex: Licence 3, Master 1..."
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="filiere">Filière *</label>
                                            <input
                                                type="text"
                                                id="filiere"
                                                name="filiere"
                                                value={formData.filiere}
                                                onChange={handleInputChange}
                                                placeholder="Ex: Informatique, Gestion..."
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cv">CV (PDF)</label>
                                            <input
                                                type="file"
                                                id="cv"
                                                name="cv"
                                                accept=".pdf"
                                                onChange={handleInputChange}
                                            />
                                            <small>Formats acceptés: PDF uniquement</small>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="lettreMotivation">Lettre de motivation (PDF)</label>
                                            <input
                                                type="file"
                                                id="lettreMotivation"
                                                name="lettreMotivation"
                                                accept=".pdf"
                                                onChange={handleInputChange}
                                            />
                                            <small>Formats acceptés: PDF uniquement</small>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Enregistrement...' : '💾 Enregistrer les modifications'}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => setEditMode(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
