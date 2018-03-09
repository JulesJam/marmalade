var User = require('../models/user');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var secret = process.env.MARMALADE_API_SECRET;

function register(req, res) {
  User.create(req.body, function(err, user) {
    console.log("req.body ",req.body)
    if(err) return res.status(400).json({
      message: "Oops those details can't be registered",
      err});

    var payload = { _id: user._id, username: user.username };
    var token = jwt.sign(payload, secret, { expiresIn: 60*60*24 });
    return res.status(200).json({
      message: "Success",
      token: token
    });
  });
}

/*function login(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if(err) res.send(500).json(err);
    if(!user || !user.validatePassword(req.body.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    var payload = { _id: user._id, username: user.username };
    var token = jwt.sign(payload, secret, { expiresIn: 60*60*24 });

    return res.status(200).json({
      message: "Success",
      token: token
    });
  });
}*/

function login(req, res) {

  passport.authenticate('local', function(err, user, token, message){
   /* var token;*/
   console.log("message", token)
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json({
        "message": "error"});
      return;
    }

    // If a user is found
    if(user){
      /*token = user.generateJwt();*/
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json({
        "message": token});
    }
  })(req, res);

};

module.exports = {
  register: register,
  login: login
}