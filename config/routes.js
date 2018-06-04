var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

var secret = process.env.MARMALADE_API_SECRET;
var upload = require('./upload');

var usersController = require('../controllers/usersController');
var authController = require('../controllers/authenticationsController');
var locationsController = require('../controllers/locationsController');
var jarsController = require('../controllers/jarsController');
var invitationsController = require('../controllers/invitationsController');


function secureRoute(req, res, next){
  console.log("Secure route activated req body",req.body);
  if(!req.headers.authorization)
    return res.status(401).json({
      message: "Unauthorised"
    });
  var token = req.headers.authorization.replace('Bearer ', '');

  jwt.verify(token, secret, function(err, payload){
    if(err|| !payload) return res.status(401).json({
      message: "Unauthorised - not logged in server responded " + err
    });
    
    req.user = payload;
    next();
  });
}



router.route('/users')
  .all(secureRoute)
  .get(usersController.index);

router.route('/users/:id')
  .all(secureRoute)
  .get(usersController.show)
  .put(usersController.update)
  .patch(usersController.update)
  .delete(usersController.delete);

router.post('/register', authController.register);
router.post('/login', authController.login);

router.route('/locations')
  .all(secureRoute)
  .post(upload.single('file'),locationsController.create)
  .get(locationsController.index);

router.route('/locations/:id')
  .get(locationsController.show)
  .put(locationsController.update)
  .patch(locationsController.update)
  .delete(locationsController.delete);

  router.route('/invitations')
    .all(secureRoute)
    .post(invitationsController.create)
    .get(invitationsController.index);

  router.route('/invitations/:id')
    .get(invitationsController.show)
    .put(invitationsController.update)
    .patch(invitationsController.update)
    .delete(invitationsController.delete);



module.exports = router;