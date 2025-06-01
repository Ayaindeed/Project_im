import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserDetails } from '../services/userService';
import '../styles/AdminUserDetail.css';

const AdminUserDetail = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const data = await getUserDetails(userId);
            setUserDetails(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Erreur lors du chargement des détails utilisateur');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!userDetails) return <div>Aucune donnée disponible pour cet utilisateur</div>;

    return (
        <div className="admin-user-detail">
            <Link to="/admin-users" className="back-link">
                &larr; Retour à la liste des utilisateurs
            </Link>
            
            <h2>Détails de l'utilisateur</h2>
            
            <div className="user-info-card">
                <h3>{userDetails.prenom} {userDetails.nom}</h3>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Rôle:</strong> {userDetails.role}</p>
                <p><strong>Date d'inscription:</strong> {new Date(userDetails.dateInscription).toLocaleDateString()}</p>
                <p><strong>Statut:</strong> {userDetails.actif ? 'Actif' : 'Inactif'}</p>
            </div>

            {userDetails.role === 'etudiant' && userDetails.etudiant && (
                <div className="etudiant-details">
                    <h3>Profil étudiant</h3>
                    <p><strong>Niveau:</strong> {userDetails.etudiant.niveau}</p>
                    <p><strong>Filière:</strong> {userDetails.etudiant.filiere}</p>
                    
                    <h4>Candidatures ({userDetails.candidatures?.length || 0})</h4>
                    {userDetails.candidatures?.length > 0 ? (
                        <div className="candidatures-list">
                            {userDetails.candidatures.map(candidature => (
                                <div key={candidature.id} className="candidature-item">                                    <p><strong>Stage:</strong> {candidature.stage.titre}</p>
                                    <p><strong>Entreprise:</strong> {candidature.stage.entreprise?.nom || 'N/A'}</p>
                                    <p><strong>Statut:</strong> 
                                        <span className={`status-badge status-${candidature.status}`}>
                                            {candidature.status}
                                        </span>
                                    </p>
                                    <p><strong>Date de postulation:</strong> {new Date(candidature.datePostulation).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Aucune candidature</p>
                    )}
                </div>
            )}

            {userDetails.role === 'entreprise' && userDetails.entreprise && (
                <div className="entreprise-details">
                    <h3>Profil entreprise</h3>
                    <p><strong>Nom:</strong> {userDetails.entreprise.nom}</p>
                    <p><strong>Secteur:</strong> {userDetails.entreprise.secteur}</p>
                    
                    <h4>Stages ({userDetails.stages?.length || 0})</h4>
                    {userDetails.stages?.length > 0 ? (
                        <div className="stages-list">
                            {userDetails.stages.map(stage => (
                                <div key={stage.id} className="stage-item">                                    <p><strong>Titre:</strong> {stage.titre}</p>
                                    <p><strong>Description:</strong> {stage.description}</p>
                                    <p><strong>Période:</strong> Du {new Date(stage.dateDebut).toLocaleDateString()} au {new Date(stage.dateFin).toLocaleDateString()}</p>
                                    <p><strong>Statut:</strong> 
                                        <span className={`status-badge status-${stage.status}`}>
                                            {stage.status}
                                        </span>
                                    </p>
                                    <p><strong>Candidatures:</strong> {stage.candidatures?.length || 0}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Aucun stage</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminUserDetail;
