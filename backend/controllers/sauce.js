const Sauce = require('../models/sauce');
const fs = require('fs');

//Permet l'affichage de toutes les sauces. 
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (things) => {
            res.status(200).json(things);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

//Permet l'affichage d'une seule sauce en récupérant son identifiant unique. 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.status(200).json(thing);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

//Permet la création d'une sauce par un utilisateur
exports.createSauce = (req, res, next) => {
    //On récupère le contenu de la requête, puis on supprime l'ID utilisateur (Utilisation des tokens pour la sécurisation)
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        //Remplacement de l'ID par l'authentification par token
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        //Initialisation des valeurs par défaut pour les likes (0)
        likes: 0,
        dislikes: 0
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: "objet enregistré!" }) })
        .catch((error) => { res.status(400).json({ error }) })
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    //Si une image est présente dans la requête, on précise l'URL de l'image, sinon la requête est prise telle quelle
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //Si ce n'est ps l'utilisateur qui a créé la sauce, pas de possibilité de la modifier
            if (sauce.userId != req.auth.userId) {
                res.status('400').json({ message: 'Non-autorisé ' });
            } else {
                //S'il y a une image dans la requête, on supprime l'ancienne image, 
                if (req.file != null) {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        //Puis on met à jour avec la nouvelle image
                        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id, imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` })
                            .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                            .catch(error => {
                                return res.status(400).json({ error });
                            });
                    }
                    )
                    //Sinon, on met à jour la sauce sans toucher à l'image
                } else {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                        .catch(error => {
                            return res.status(400).json({ error });
                        });
                }
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        })
};

//Suppression d'une sauce 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //Si ce n'est ps l'utilisateur qui a créé la sauce, pas de possibilité de la supprimer
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                //Suppression de l'image associée à la sauce, et suppression de la sauce
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

//Mise en place du système de like
exports.like = (req, res, next) => {
    let userId = req.auth.userId;
    let likeStatus = req.body.like;

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //Si la requête concerne un like, on incrémente le compteur like et on ajoute l'utilisateur dans le tableau usersLiked
            if (likeStatus === 1) {

                sauce.updateOne({ $inc: { likes: +1 }, $push: { usersLiked: userId } })
                    .then(() => { res.status(200).json({ message: 'Like pris en compte ! ' }) })
                    .catch(error => res.status(400).json({ error }));
                //Si la requête est un dislike, on incrémente le compteur dislike et on ajoute l'utilisateurdans le tableau usersDisliked
            } else if (likeStatus === -1) {

                sauce.updateOne({ $inc: { dislikes: +1 }, $push: { usersDisliked: userId } })
                    .then(() => { res.status(200).json({ message: 'Like pris en compte ! ' }) })
                    .catch(error => res.status(400).json({ error }))
                //Si la requête est une annulation,on vérifie dans quel tableau (usersLiked/usersDisliked) l'utilisateur se trouve
            } else if (likeStatus === 0) {
                // S'il est dans le tableau isersDisliked, on décrémente le compteur dislike et on enlève l'utilisateur du tableau
                if (sauce.usersDisliked.includes(userId)) {

                    sauce.updateOne({ $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } })
                        .then(() => { res.status(200).json({ message: 'Like pris en compte ! ' }) })
                        .catch(error => res.status(400).json({ error }))
                //S'il est dans le tableau usersLiked, on décrémente le compteur like et on enlève l'utilisateur du tableau
                } else if (sauce.usersLiked.includes(userId)) {

                    sauce.updateOne({ $inc: { likes: -1 }, $pull: { usersLiked: userId } })
                        .then(() => { res.status(200).json({ message: 'Like pris en compte ! ' }) })
                        .catch(error => res.status(400).json({ error }))
                }

            };
        });

};

