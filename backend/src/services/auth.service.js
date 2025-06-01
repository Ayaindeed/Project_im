const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Etudiant, Entreprise } = require('../models');

class AuthService {
    async registerAdmin(userData) {
        const { nom, prenom, email, motdepasse, adminCode } = userData;

        if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
            throw new Error('Code administrateur invalide');
        }

        const user = await User.create({
            nom,
            prenom,
            email,
            motdepasse: await bcrypt.hash(motdepasse, 10),
            role: 'admin',
            dateInscription: new Date(),
            actif: true
        });

        return user;
    }

    async registerEtudiant(userData) {
        const { nom, prenom, email, motdepasse, niveau, filiere, cv, lettreMotivation } = userData;

        const user = await User.create({
            nom,
            prenom,
            email,
            motdepasse: await bcrypt.hash(motdepasse, 10),
            role: 'etudiant',
            dateInscription: new Date(),
            actif: true
        });

        const etudiant = await Etudiant.create({
            userId: user.id,
            niveau,
            filiere,
            cv,
            lettreMotivation
        });

        return { user, etudiant };
    }

    async registerEntreprise(userData) {
        const { nom, prenom, email, motdepasse, nomEntreprise, secteur, adresse, siteWeb, description } = userData;

        const user = await User.create({
            nom,
            prenom,
            email,
            motdepasse: await bcrypt.hash(motdepasse, 10),
            role: 'entreprise',
            dateInscription: new Date(),
            actif: true
        });

        const entreprise = await Entreprise.create({
            userId: user.id,
            nom: nomEntreprise,
            secteur,
            adresse,
            siteWeb,
            description
        });

        return { user, entreprise };
    }
}

module.exports = new AuthService();