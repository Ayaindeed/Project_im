const { Stage, Entreprise, User } = require('../models');

class StageService {
    async createStage(stageData, entrepriseId) {
        const stage = await Stage.create({
            ...stageData,
            entrepriseId,
            status: 'disponible'
        });
        return stage;
    }

    async getStagesByEntreprise(entrepriseId) {
        const stages = await Stage.findAll({
            where: { entrepriseId },
            include: [{
                model: Entreprise,
                as: 'entreprise',
                include: [{
                    model: User,
                    as: 'user'
                }]
            }]
        });
        return stages;
    }

    async getAllStages() {
        const stages = await Stage.findAll({
            where: { status: 'disponible' },
            include: [{
                model: Entreprise,
                as: 'entreprise',
                attributes: ['id', 'nom', 'secteur']
            }]
        });
        return stages;
    }
}

module.exports = new StageService();