//1: appel des plugins
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//2: appel des fichiers dont j'ai besoin
const User = require('../models/User');

//3: inscription utilisateur
exports.signup = (req,res, next)=> {
  bcrypt.hash(req.body.password, 10)
  .then(hash =>{
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(()=> res.status(201).json({ message: 'Utilisateur créé !'}))
    .catch(error => res.status(400).json({error}));
  })
  .catch(error => res.status(500).json({error}));
};

//4: connexion utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              '79ECB7428900113AC26D45C320D659AEE0AD115ED3B60401E53972E02F7252FF',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};