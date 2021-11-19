//1: appel des plugins
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//2: appel des fichiers
const saucesCtrl = require('../controllers/sauce');

// 3:création des routes et appel des fonctions
router.post('/', auth, multer, saucesCtrl.createSauce);
router.post('/:id/like',auth, saucesCtrl.modifySauceLike);
router.put('/:id',auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/', saucesCtrl.getAllSauces);
router.get('/:id',auth, saucesCtrl.getOneSauce);

//4: exports
module.exports = router;