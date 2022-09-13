const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const User = require("../models/user");

//Création d'un nouvel utilisateur 
exports.signup = (req, res, next) => {
    //Utilisateur de bcrypt pour protéger le mot de passe
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //Création du nouvel utilisateur, puis sauvegarde
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé!" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//Connexion d'un utilisateur 
exports.login = (req, res, next) => {
    //Vérification de l'existence de l'utilisateur dans la BDD, via l'adresse mail
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error });
            }
            //On compare les mots de passe hashés grâce à bcrypt
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error });
                    }
                    //Si l'identification est valide, on créé un token d'authentification avec la clé stockée dans les variables environnementales
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            `${process.env.KEY}`,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};