const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user');
//Permets l'utilisation d'express
const app = express();

//Utilisation d'un package pour authoriser les CORS
app.use(cors());

//Parse les requêtes JSON et mets ces informations dans req.body
app.use(express.json());

//Connexion de la base de donnée MongoDB
mongoose.connect('mongodb+srv://Solyane:JrYBdKcl54wfmbP7@cluster0.akbs6yx.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/api/auth', userRoutes);

//Exportation du module pour pouvoir l'utiliser à travers le projet
module.exports = app;