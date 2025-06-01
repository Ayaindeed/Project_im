import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';  // Changed from useNavigate
import { registerUser } from '../../services/authService';
import leftImage from '../../assets/im1.png';
import rightImage from '../../assets/im2.png';

const Register = () => {
    const [form, setForm] = useState({
        nom: '',
        prenom: '',
        email: '',
        motdepasse: '',
        role: 'etudiant',
        niveau: '',
        filiere: '',
        cv: '',
        lettreMotivation: ''
    });

    const [error, setError] = useState('');
    const history = useHistory();  // Changed from useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(form);
            history.push('/login');  // Changed from navigate
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription");
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-container">
                <div className="login-images">
                    <div className="image-left">
                        <img src={leftImage} alt="Welcome" />
                    </div>
                    <div className="image-right">
                        <img src={rightImage} alt="Features" />
                    </div>
                </div>
                
                <div className="register-box">
                    <div className="register-form-container">
                        <h2>Inscription Étudiant</h2>
                        <p className="register-subtitle">
                            Créez votre compte étudiant pour accéder aux stages
                        </p>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit} className="register-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Nom</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.nom}
                                        onChange={(e) => setForm({...form, nom: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Prénom</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.prenom}
                                        onChange={(e) => setForm({...form, prenom: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={form.email}
                                    onChange={(e) => setForm({...form, email: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Mot de passe</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={form.motdepasse}
                                    onChange={(e) => setForm({...form, motdepasse: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Niveau d'études</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.niveau}
                                    onChange={(e) => setForm({...form, niveau: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Filière</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.filiere}
                                    onChange={(e) => setForm({...form, filiere: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">CV (URL)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.cv}
                                    onChange={(e) => setForm({...form, cv: e.target.value})}
                                    placeholder="Lien vers votre CV"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Lettre de Motivation (URL)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.lettreMotivation}
                                    onChange={(e) => setForm({...form, lettreMotivation: e.target.value})}
                                    placeholder="Lien vers votre lettre de motivation"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-block">
                                S'inscrire
                            </button>
                        </form>

                        <div className="register-footer">
                          <p>Déjà membre ?</p>
                          <Link to="/login" className="btn btn-secondary btn-block">
                            Se connecter
                          </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;