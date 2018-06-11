var User = require('../models/user');
var Jar = require('../models/jar');
var Invitation = require('../models/invitation');
var jwt = require('jsonwebtoken');
var passport = require('passport');

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
    else if(user && !user.inviteCode)
    {
      console.log("stage 2");
      newJar = new Jar();

      console.log("the new jar is ", newJar);
      newJar.jarName = req.body.jarName;
      newJar.creatorId = user._id;
      newJar.members.push(user._id);
      newJar.treeManager=[{branchCode: '0', members: user._id}];
      console.log("Jar creation stage 1 req.body", newJar);
      createJarAndAddUser(newJar, user, res);
    } 
    else if(user && user.inviteCode)
    { console.log("looking for invitation",req.body.inviteCode)
      var inviteCode = req.body.inviteCode;

      findInviteAndUpdateJarAndUser(user, res)
      }
  })
}


function createJarAndAddUser (newJar, user, res){
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
                                  membershipLevel: 0, branchCode: ''}];
              user.jarOwnerJarId = jar._id;
              User.update ({_id: user._id}, user, function(err, updatedUser){
                if(err){
                  return res.status(400).json(err)
                }else {
                  console.log("updated user is ", user, "update", updatedUser);
                 buildToken(user, jar, res);
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
  )
}

function findInviteAndUpdateJarAndUser (user, res){
  Invitation.findById(user.inviteCode, function(err, invitation){
    if(err){
      return res.status(400).json(err,{message: "Invitation not found"})
    }
    else {
      console.log("invitation found ", invitation);
      var testjar = new Jar()
      testjar.jarName ="TestJar";
      buildToken(user, jar, res); 
    }
  })

}

function buildToken(user, jar, res){
  var payload = { 
    _id: user._id,
    firstName: user.firstName,
    lastName:   user.lastName,
    primaryJarId: user.primaryJarId.jarId,
    primaryJarMembershipLevel: user.primaryJarId.membershipLevel,
    primaryJarBranchCode: user.primaryJarId.branchCode,
    jarOwnerJarId: user.jarOwnerJarId,
    jarName: jar.jarName 
  };

  var token = jwt.sign(payload, secret, { expiresIn: 60*60*2 });
  return res.status(200).json({
  message: "Success",
  token: token
  })
};


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