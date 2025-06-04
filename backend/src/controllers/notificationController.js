const { notification: Notification, etudiant: Etudiant, candidature: Candidature, stage: Stage, entreprise: Entreprise } = require('../models');

// Récupérer toutes les notifications d'un étudiant
exports.getNotifications = async (req, res) => {
  try {
    // Trouver l'étudiant basé sur le userId
    const etudiant = await Etudiant.findOne({
      where: { userId: req.userId }
    });

    if (!etudiant) {
      return res.status(404).json({ message: 'Profil étudiant non trouvé' });
    }
    
    const notifications = await Notification.findAll({
      where: { etudiantId: etudiant.id },
      include: [
        {
          model: Candidature,
          as: 'candidature',
          include: [
            {
              model: Stage,
              as: 'stage',
              include: [
                {
                  model: Entreprise,
                  as: 'entreprise',
                  attributes: ['nom']
                }
              ]
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Trouver l'étudiant basé sur le userId
    const etudiant = await Etudiant.findOne({
      where: { userId: req.userId }
    });

    if (!etudiant) {
      return res.status(404).json({ message: 'Profil étudiant non trouvé' });
    }

    const notification = await Notification.findOne({
      where: { id, etudiantId: etudiant.id }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    await notification.update({ lue: true });

    res.json({ message: 'Notification marquée comme lue' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Marquer toutes les notifications comme lues
exports.markAllAsRead = async (req, res) => {
  try {
    // Trouver l'étudiant basé sur le userId
    const etudiant = await Etudiant.findOne({
      where: { userId: req.userId }
    });

    if (!etudiant) {
      return res.status(404).json({ message: 'Profil étudiant non trouvé' });
    }

    await Notification.update(
      { lue: true },
      { where: { etudiantId: etudiant.id, lue: false } }
    );

    res.json({ message: 'Toutes les notifications marquées comme lues' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des notifications:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Trouver l'étudiant basé sur le userId
    const etudiant = await Etudiant.findOne({
      where: { userId: req.userId }
    });

    if (!etudiant) {
      return res.status(404).json({ message: 'Profil étudiant non trouvé' });
    }

    const notification = await Notification.findOne({
      where: { id, etudiantId: etudiant.id }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    await notification.destroy();

    res.json({ message: 'Notification supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir le nombre de notifications non lues
exports.getUnreadCount = async (req, res) => {
  try {
    // Trouver l'étudiant basé sur le userId
    const etudiant = await Etudiant.findOne({
      where: { userId: req.userId }
    });

    if (!etudiant) {
      return res.status(404).json({ message: 'Profil étudiant non trouvé' });
    }

    const count = await Notification.count({
      where: { etudiantId: etudiant.id, lue: false }
    });

    res.json({ count });
  } catch (error) {
    console.error('Erreur lors du comptage des notifications:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
