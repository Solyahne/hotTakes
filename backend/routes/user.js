const express = require("express");
const userCtrl = require("../controllers/user");
const verifypassword = require('../middleware/verifypassword');

const router = express.Router();


router.post("/signup", verifypassword, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router; 