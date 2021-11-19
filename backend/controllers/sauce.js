//1: appel des plugins
const fs = require('fs');

//2: appel des fichiers requis, ici le models de sauce
const Sauce = require('../models/Sauces')

// 3: création de la logique pour l'ajout, modification, suppression ou like d'une sauce (CRUD)
exports.createSauce = (req, res,next)=> {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });

  sauce.save()
    .then(()=>res.status(201).json({message:'produit enregistré'}))
    .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.thing),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }:{...req.body};
  Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
  .then(()=>res.status(200).json({message:'produit modifié'}))
  .catch(error =>res.status(403).json({error}));
  
};

exports.modifySauceLike = (req, res, next) => {

 let like = req.body.like;
 let userId = req.body.userId;
 let sauceId = req.params.id
 Sauce.findOne({ _id : sauceId})
 .then(sauce => {
  const areYouLiked = {
    usersLiked: sauce.usersLiked,
    usersDisLiked: sauce.usersDisLiked,
    likes: 0,
    dislikes: 0
  }

 
 switch(like){
    case 1 :
      if (like == 1){  // cas numéro 1 (like)
        Sauce.updateOne({_id: sauceId}, { $push: { usersLiked : userId }, $inc:{ likes: areYouLiked.usersLiked.length } }) //j'utilise la syntaxe de mongo pour ajouter un like si nous sommes dans le cas 1
        
        .then(() => res.status(200).json({
          message: 'j\'aime ajouté !'
        }))
        .catch((error) => res.status(400).json({
          error
        }))
      }
      break;

    case 0 :
      if (areYouLiked.usersLiked.includes(userId)){
        
        Sauce.updateOne({_id: sauceId}, { $pull: { usersLiked : userId }, $inc:{ likes: areYouLiked.usersLiked.length} }) //j'utilise la syntaxe de mongo pour ajouter un like si nous sommes dans le cas 1
        
        .then(() => res.status(200).json({
          message: 'j\'aime retiré !'
        }))
        .catch((error) => res.status(400).json({
          error
        }))
      }
      if (areYouLiked.usersDisLiked.includes(userId)){
        Sauce.updateOne({_id: sauceId}, { $pull: { usersDisLiked : userId }, $inc:{ likes: areYouLiked.usersDisLiked.length} }) //j'utilise la syntaxe de mongo pour ajouter un like si nous sommes dans le cas 1
        
        .then(() => res.status(200).json({
          message: 'je déteste retiré !'
        }))
        .catch((error) => res.status(400).json({
          error
        }))
      }
      break;

    case -1 :
      if (like == -1){  // cas numéro 3 (dislike)
        Sauce.updateOne({_id: sauceId}, { $push: { usersDisLiked : userId }, $inc:{ likes: areYouLiked.usersDisLiked.length } }) //j'utilise la syntaxe de mongo pour ajouter un dislike si nous sommes dans le cas 1
       
        .then(() => res.status(200).json({
          message: 'je n\'aime pas ajouté !'
        }))
        .catch((error) => res.status(400).json({
          error
        }))
      }
      break;
  }
})
.catch(error => res.status(500).json({ error }));  
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Produit supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => res.status(200).json(sauce))
  .catch(error =>res.status(403).json({error}));
};



