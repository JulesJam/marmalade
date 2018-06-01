var User = require('../models/user');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var Jar = require('../models/jar')
var secret = process.env.MARMALADE_API_SECRET;

function register(req, res) {
  var date = Date.now();
  req.body.visits.push(date);
  User.create(req.body, function(err, user) {
    console.log("req.body - user ",req.body)
    if(err){
      console.log("stage 1 error", err);;
      return res.status(400).json({
          message: "Oops those details can't be registered",
          err});
    } 
    else if(user)
    {
      console.log("stage 2");
      newJar = new Jar();
      newJar.jarName = req.body.jarName;
      newJar.creatorId = user._id;
      newJar.members.push(user._id);
      console.log("Jar creation stage 1 req.body", newJar);
      Jar.create(newJar, (function(err, jar){
        if (jar){
          console.log("jar created is ",jar);
          User.findById(user._id,function(err, user) {
              console.log("stage 3 user ",user._id, "error ", err, "user ? ", user)
              if(err){
                return res.status(400).json(err);
              } else {
                user.primaryJarId = {jarId: jar._id,
                                    membershipLevel: 0};
                user.jarMemberships = [{jarId: jar._id,
                                    membershipLevel: 0}];
                user.jarOwnerJarId = jar._id;
                User.update ({_id: user._id}, user, function(err, update){
                  if(err){
                    return res.status(400).json(err)
                  }else {
                    console.log("updated user is ", user, "update", update);
                    var payload = { _id: user._id, firstName: user.firstName, lastName:   user.lastName , primaryJarId: user.primaryJarId.jarId, jarOwnerJarId: user.jarOwnerJarId, jarName: jar.jarName };
                    var token = jwt.sign(payload, secret, { expiresIn: 60*60*2 });
                    return res.status(200).json({
                    message: "Success",
                    token: token
                  })
                  }
                })
              }
          })
        } 
        else if (err){
          console.log("register error occured", err);
          res.status(500).json(err);
        }
      })
    )}
  })
}





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