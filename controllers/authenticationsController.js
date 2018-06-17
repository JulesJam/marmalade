var User = require('../models/user');
var Jar = require('../models/jar');
var Invitation = require('../models/invitation');
var jwt = require('jsonwebtoken');
var passport = require('passport');

var secret = process.env.MARMALADE_API_SECRET;

function register(req, res) {
  var date = Date.now();
  //change this so that if there is an invite code the user is not created until the invite is processed?
  req.body.visits.push(date);
  if (!req.body.inviteCode){
    User.create(req.body, function(err, user) {
      console.log("req.body - user ",req.body)
      if(err){
        console.log("stage 1 error", err);
        message = "Oops those details can't be registered " + err
        return res.status(400).json({err: err,
            message: message });
      } 
      else 
      {
        console.log("stage 2");
        newJar = new Jar();

        console.log("the new jar is ", newJar);
        newJar.jarName = req.body.jarName;
        newJar.creatorId = user._id;
        newJar.members.push(user._id);
        newJar.childCodeTracker = 0;
        newJar.treeManager=[{branchCode: [0], members: user._id}];
        console.log("Jar creation stage 1 req.body", newJar);
        createJarAndAddUser(newJar, user, res);
      }  
    })
  } else {
    console.log("looking for invitation",req.body.inviteCode)
    var inviteCode = req.body.inviteCode;
    findInviteAndUpdateJarAndUser(req.body, res)
  }

}


function createJarAndAddUser (newJar, user, res){
  console.log("newJar being passed is >>>>", newJar)
    Jar.create(newJar, (function(err, jar){
      if (jar){
        console.log("jar created is ",jar);
        User.findById(user._id,function(err, user) {
            console.log("stage 3 user ",user._id, "error ", err, "user ? ", user, "Jar", jar)
            if(err){
              return res.status(400).json(err);
            } else {
              user.primaryJarId = {jarId: jar._id,
                                  membershipLevel: 0,
                                  branchCode: [0],
                                  childCode: null};
              user.jarMemberships = [{jarId: jar._id,
                                  membershipLevel: 0,
                                  branchCode: [0],
                                  childCode: null}];
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

function findInviteAndUpdateJarAndUser (newUser, res){
  Invitation.findById(newUser.inviteCode, function(err, invitation){
    if(err){
      message = "Oops that inviation can't be found " + err
      return res.status(400).json({err: err, message: message})
    } else if (invitation && invitation.status != "Pending" ){
      message = "Oops that inviation is no longer valid - please ask your friend to re-invite you " + err
      return res.status(400).json({err: err, message: message})
    } else

    {
      console.log("invitation found ", invitation);
      User.create(newUser, function(err, user){
        console.log("req.body - user ",newUser)
        if(err){
          console.log("stage 1 error", err);
          message = "Oops those details can't be registered " + err
          return res.status(400).json({err: err,
              message: message });
        }
        else{
          Jar.findById(invitation.jarId, function(err, jar){
            if(err){
              return res.status(400).json(err,{message: "Invitation Jar Not Found"})
            } else if(jar){
              console.log("We have a jar>>>>???? ",jar);
                
              console.log("jar.childCodeTracker ",jar.childCodeTracker," sender childcode",jar.treeManager[jar.childCodeTracker]);

              user.membershipLevel = invitation.invitationMembershipLevel;
              user.primaryJarId ={
                jarId: jar._id,
                membershipLevel: invitation.invitationMembershipLevel,
                branchCode: invitation.invitationBranchCode,
                childCode: null},
              user.jarMemberships = [{
                jarId: jar._id,
                membershipLevel: invitation.invitationMembershipLevel,
                branchCode: invitation.invitationBranchCode,
                childCode: invitation.childCode}];
              User.update({_id: user._id}, user, function(err, updatedUser){
                if(err){
                  return res.status(400).json(err)
                }else {
                  jar.treeManager[invitation.invitationChildCode].members.push(user._id);
                  Jar.update({_id: invitation.jarId}, jar, function(err, updatedJar){
                    if(err){
                      return res.status(400).json(err, {message: "Jar Update failed after creating invited user"})
                    } else {
                      console.log("updated user is ", user, "updated Jar", updatedJar);
                      now = Date.now();
                      Invitation.update({_id: invitation._id},{status: 'accepted', acceptedDate: now}, function(err, updatedInvitation){
                        if(err){
                          return res.status(400).json(err, {message: "Jar Update failed after creating invited user"})
                        }
                        else{
                          console.log("Invitation accepted", updatedInvitation)
                          buildToken(user, jar, res);
                        }
                      }) 
                    }
                  })
                }
              })
                  
            }
          })
        }  
      })
    }
  })
}


function buildToken(user, jar, res){
  console.log("Token Builder +++++ ", jar.jarName);
  var jarMemberShip = {
    jarId: user.primaryJarId.jarId,
    membershipLevel: user.primaryJarId.membershipLevel,
    branchCode: user.primaryJarId.branchCode,
    childCode: user.primaryJarId.childCode
  }
  var payload = { 
    _id: user._id,
    firstName: user.firstName,
    lastName:  user.lastName,
    primaryJarId: jarMemberShip,
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