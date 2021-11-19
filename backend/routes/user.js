//1: appel des plugins
const express = require('express');
const router = express.Router();

//2: appel du contrôleur
const userCtrl = require('../controllers/user');

//3: appel des routes utilisateur
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//4: export
module.exports = router;