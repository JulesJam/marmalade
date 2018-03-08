var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var secret = process.env.MARMALADE_API_SECRET;

var usersController = require('../controllers/users');
var authController = require('../controllers/authentications');

function secureRoute(req, res, next){
  if(!req.headers.authorization)
    return res.status(401).json({
      message: "Unauthorised"
    });
  var token = req.headers.authorization.replace('Bearer ', '');

  jwt.verify(token, secret, function(err, payload){
    if(err|| !payload) return res.status(401).json({
      message: "Unauthorised"
    });
    req.user = payload;
    next();
  });
}


var locationsController = require('../controllers/locationsController');

router.route('/users')
  .all(secureRoute)
  .get(usersController.index)
  .post(usersController.create);

router.route('/users/:id')
  .all(secureRoute)
  .get(usersController.show)
  .put(usersController.update)
  .patch(usersController.update)
  .delete(usersController.delete);

router.post('/register', authController.register);
router.post('/login', authController.login);

router.route('/locations')
  .post(locationsController.create)
  .get(locationsController.index);

router.route('/locations/:id')
  .get(locationsController.show)
  .put(locationsController.update)
  .patch(locationsController.update)
  .delete(locationsController.delete);


module.exports = router;