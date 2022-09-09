const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require("helmet");
const rateLimit = require('express-rate-limit');

dotenv.config();

const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//Permets l'utilisation d'express
const app = express();

//Utilisation d'un package pour authoriser les CORS
app.use(cors());

//Parse les requêtes JSON et mets ces informations dans req.body
app.use(express.json());

//Ajout d'Helmet pour plus de sécurisation, mais authorisation du CORS pour les besoins du développement 
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false
  })
);

//Ajout d'express-rate-limit afin d'empêcher des attaques type brute force
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}); 

app.use('/api', apiLimiter)

//Connexion de la base de donnée MongoDB. Utilisation de variables environnementales pour sécuriser les informations. 
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_ADDRESS}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

//Exportation du module pour pouvoir l'utiliser à travers le projet
module.exports = app;