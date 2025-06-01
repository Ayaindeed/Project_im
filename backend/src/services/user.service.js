const { User, Etudiant, Entreprise } = require('../models');

class UserService {
    async getUserById(userId) {
        const user = await User.findByPk(userId, {
            attributes: ['id', 'nom', 'prenom', 'email', 'role', 'dateInscription', 'actif']
        });
        return user;
    }

    async toggleUserStatus(userId) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('Utilisateur non trouvé');
        
        user.actif = !user.actif;
        await user.save();
        return user;
    }

    async getAllUsers() {
        const users = await User.findAll({
            attributes: ['id', 'nom', 'prenom', 'email', 'role', 'dateInscription', 'actif']
        });
        return users;
    }
}

module.exports = new UserService();