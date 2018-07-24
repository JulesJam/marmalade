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
var jarLocationsController = require('../controllers/jarLocationsController');
var userLocationsController = require('../controllers/userLocationsController')
var userConfirmationsController = require('../controllers/userConfirmationsController')


function secureRoute(req, res, next){
  console.log("Secure route activated req body",req.headers.authorization);
  if(!req.headers.authorization)
    return res.status(401).json({
      message: "Unauthorised"
    });
  var token = req.headers.authorization.replace('Bearer ', '');
  console.log("the token is ",token);
  jwt.verify(token, secret, function(err, payload){
    if(err|| !payload) {
      console.log("The token error is", err, "the payload is ", payload);
      return res.status(401).json({
        message: "Unauthorised - not logged in server responded " + err
      });
    }
    
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

router.route('/jarLocations')
  .all(secureRoute)
  .post(upload.single('file'), jarLocationsController.create)
  .get(jarLocationsController.index);
router.route('/jarLocations/:id')
  .get(jarLocationsController.show)
  .put(jarLocationsController.update)
  .patch(jarLocationsController.update)
  .delete(jarLocationsController.delete);

  router.route('/jar')
    .all(secureRoute)
    .get(jarsController.index);
  router.route('/jar/:id')
    .get(jarsController.show)
    .put(jarsController.update)
    .patch(jarsController.update)
    .delete(jarsController.delete);




router.route('/userLocations')
  .all(secureRoute)
  .post(upload.single('file'), userLocationsController.create)
  .get(userLocationsController.index);
router.route('/userLocations/:id')
  .get(userLocationsController.show)
  .put(userLocationsController.update)
  .patch(userLocationsController.update)
  .delete(userLocationsController.delete);

router.route('/invitations')
  .post(secureRoute, invitationsController.create)
  .get(secureRoute, invitationsController.index);
router.route('/invitations/:id')
  .get(invitationsController.show)
  .put(secureRoute, invitationsController.update)
  .patch(secureRoute, invitationsController.update)
  .delete(secureRoute, invitationsController.delete);

router.route('/userConfirmation/:id')
  .post(userConfirmationsController.accept);



module.exports = router;