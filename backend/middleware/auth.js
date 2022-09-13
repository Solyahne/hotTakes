const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

//Création de la technique d'authentification par token 
module.exports = (req, res, next) => {
    try {
        //On split après un espace pour supprimer "bearer" de la requête
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${process.env.KEY}`);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};