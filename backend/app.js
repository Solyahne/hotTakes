const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//Permets l'utilisation d'express
const app = express();

//Utilisation d'un package pour authoriser les CORS
app.use(cors());

//Parse les requêtes JSON et mets ces informations dans req.body
app.use(express.json());

//Connexion de la base de donnée MongoDB
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