import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';  // Changed from useNavigate
import { registerUser } from '../../services/authService';
import GoogleAuthButton from './GoogleAuthButton';
import leftImage from '../../assets/im1.png';
import rightImage from '../../assets/im2.png';
import '../../styles/Auth.css';

const Register = () => {
    const [form, setForm] = useState({
        nom: '',
        prenom: '',
        email: '',
        motdepasse: '',
        role: 'etudiant',
        niveau: '',
        filiere: '',
        cv: null,
        lettreMotivation: null
    });

    const [error, setError] = useState('');
    const [dragStates, setDragStates] = useState({
        cv: false,
        lettreMotivation: false
    });
    const history = useHistory();  // Changed from useNavigate

    // Handle drag and drop events
    const handleDragOver = (e, fileType) => {
        e.preventDefault();
        setDragStates(prev => ({ ...prev, [fileType]: true }));
    };

    const handleDragLeave = (e, fileType) => {
        e.preventDefault();
        setDragStates(prev => ({ ...prev, [fileType]: false }));
    };

    const handleDrop = (e, fileType) => {
        e.preventDefault();
        setDragStates(prev => ({ ...prev, [fileType]: false }));
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/pdf') {
                setForm(prev => ({ ...prev, [fileType]: file }));
            } else {
                setError('Seuls les fichiers PDF sont acceptés.');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({ ...prev, [fileType]: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('nom', form.nom);
            formData.append('prenom', form.prenom);
            formData.append('email', form.email);
            formData.append('motdepasse', form.motdepasse);
            formData.append('role', form.role);
            formData.append('niveau', form.niveau);
            formData.append('filiere', form.filiere);
            
            if (form.cv) {
                formData.append('cv', form.cv);
            }
            if (form.lettreMotivation) {
                formData.append('lettreMotivation', form.lettreMotivation);
            }
            
            await registerUser(formData);
            history.push('/login');  // Changed from navigate
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription");
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-container">
                <div className="register-images">
                    <div className="image-stack">
                        <img src={leftImage} alt="Welcome" className="stacked-image" />
                        <img src={rightImage} alt="Features" className="stacked-image" />
                    </div>
                </div>
                
                <div className="register-box">
                    <div className="register-form-container">
                        <h2>Inscription Étudiant</h2>
                        <p className="register-subtitle">
                            Créez votre compte étudiant pour accéder aux stages
                        </p>

                        {error && <div className="error-message">{error}</div>}

                        <GoogleAuthButton type="register" />
                        
                        <div className="divider">
                            <span>ou</span>
                        </div>

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
                                <label className="form-label">CV (Joindre la pièce)</label>
                                <div className="file-upload-container">
                                    <input
                                        type="file"
                                        id="cv-upload"
                                        className="file-input-hidden"
                                        accept=".pdf"
                                        onChange={(e) => handleFileChange(e, 'cv')}
                                    />
                                    <label 
                                        htmlFor="cv-upload" 
                                        className={`file-upload-button ${form.cv ? 'has-file' : ''} ${dragStates.cv ? 'drag-over' : ''}`}
                                        onDragOver={(e) => handleDragOver(e, 'cv')}
                                        onDragLeave={(e) => handleDragLeave(e, 'cv')}
                                        onDrop={(e) => handleDrop(e, 'cv')}
                                    >
                                        <div className="file-upload-content">
                                            <svg className="upload-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <div className="file-upload-text">
                                                {form.cv ? (
                                                    <span className="file-selected">✓ {form.cv.name}</span>
                                                ) : (
                                                    <>
                                                        <span className="upload-main-text">Cliquez pour télécharger votre CV</span>
                                                        <span className="upload-sub-text">ou glissez-déposez le fichier ici</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <small className="form-text text-muted">Format accepté : PDF uniquement</small>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Lettre de Motivation (Joindre la pièce)</label>
                                <div className="file-upload-container">
                                    <input
                                        type="file"
                                        id="lettre-upload"
                                        className="file-input-hidden"
                                        accept=".pdf"
                                        onChange={(e) => handleFileChange(e, 'lettreMotivation')}
                                    />
                                    <label 
                                        htmlFor="lettre-upload" 
                                        className={`file-upload-button ${form.lettreMotivation ? 'has-file' : ''} ${dragStates.lettreMotivation ? 'drag-over' : ''}`}
                                        onDragOver={(e) => handleDragOver(e, 'lettreMotivation')}
                                        onDragLeave={(e) => handleDragLeave(e, 'lettreMotivation')}
                                        onDrop={(e) => handleDrop(e, 'lettreMotivation')}
                                    >
                                        <div className="file-upload-content">
                                            <svg className="upload-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <div className="file-upload-text">
                                                {form.lettreMotivation ? (
                                                    <span className="file-selected">✓ {form.lettreMotivation.name}</span>
                                                ) : (
                                                    <>
                                                        <span className="upload-main-text">Cliquez pour télécharger votre lettre</span>
                                                        <span className="upload-sub-text">ou glissez-déposez le fichier ici</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <small className="form-text text-muted">Format accepté : PDF uniquement</small>
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