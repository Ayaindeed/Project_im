import React, { useState } from 'react';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return (
        <div className="card">
            <h1>Dashboard</h1>
            <p>Bienvenue {user.prenom ? user.prenom : ''} {user.nom ? user.nom : ''} sur la plateforme de gestion des stages !</p>
        </div>
    );
};

export default Dashboard;