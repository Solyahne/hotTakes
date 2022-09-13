const express = require("express");
const userCtrl = require("../controllers/user");
const verifyPassword = require('../middleware/verifypassword');
const verifyEmail = require('../middleware/verifyemail');

const router = express.Router();

//Gestion des routes utilisateur, avec ajout de la vérification Email et MdP
router.post("/signup", verifyEmail, verifyPassword, userCtrl.signup);
router.post("/login", verifyEmail, verifyPassword, userCtrl.login);

module.exports = router; 