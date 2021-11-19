// require des fichiers
// les plugins
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require("helmet");
//les routes
const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user');

//appel d'express
const app = express();
app.use(helmet());
//Connexion à la database
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//mise en place des en-têtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//convertir les données reçues
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
 
  //utilisation des routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

//6-export du fichier app
module.exports = app;