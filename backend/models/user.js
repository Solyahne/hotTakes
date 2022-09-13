const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Modèle utilisé pour les utilisateurs
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//Renforcement de la sécurité en vérifiant que l'email n'a pas déjà été utilisé en utilisant le package approprié
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);