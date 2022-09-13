const express = require("express");
const userCtrl = require("../controllers/user");
const verifyPassword = require('../middleware/verifypassword');
const verifyEmail = require('../middleware/verifyemail');

const router = express.Router();


router.post("/signup", verifyEmail, verifyPassword, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router; 