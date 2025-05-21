const { Candidature } = require('../models');

exports.createCandidature = async (req, res) => {
    try {
        const candidature = await Candidature.create(req.body);
        res.status(201).json(candidature);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllCandidatures = async (req, res) => {
    try {
        const candidatures = await Candidature.findAll();
        res.json(candidatures);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCandidature = async (req, res) => {
    try {
        const candidature = await Candidature.findByPk(req.params.id);
        if (!candidature) return res.status(404).json({ error: 'Candidature introuvable' });
        await candidature.update(req.body);
        res.json(candidature);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};