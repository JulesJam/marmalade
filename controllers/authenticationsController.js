var User = require('../models/user');
var Jar = require('../models/jar');
var UserConfirmation = require('../models/userConfirmation');
var Invitation = require('../models/invitation');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var email = require('../config/email');

var secret = process.env.MARMALADE_API_SECRET;

function register(req, res) {
  var date = Date.now();
  //change this so that if there is an invite code the user is not created until the invite is processed?
  console.log("Checking for invite ", req.body.inviteCode," or Jar ", req.body.jarName)
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
    if(err || !invitation){
      message = "Oops that invitation can't be found please ask the sender to create a new invitation or "
      return res.status(400).json({err: err, message: message})
    } else if (invitation && invitation.status != "Pending"){
      message = "Oops that inviation is no longer valid - please ask your friend to re-invite you "
      return res.status(400).json({err: err, message: message})
    } else if (invitation && !invitation.jarId  ){
      message = "Oops that inviation has errors - please ask your friend to re-invite you "
      return res.status(400).json({err: err, message: message})
    }
      else
    {
      console.log("invitation found ", invitation);
      User.create(newUser, function(err, user){
        console.log("req.body - user ",newUser)
        if(err){
          console.log("stage 1 error", err);
          message = "Oops those details can't be registered for the following reason " + err
          return res.status(400).json({err: err,
              message: message });
        }
        else{
          Jar.findById(invitation.jarId, function(err, jar){
            if(err){
              message = "Invitation Jar Not Found"
              return res.status(400).json({err: err, message: message })
            } else if(jar){
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
                  console.log("Jar BEFORE accept ", jar)
                  jar.invitations = jar.invitations.filter(function(foundInvitation){
                    if(!foundInvitation.equals(invitation._id)){
                      return foundInvitation != invitation._id
                    }
                  });
                  console.log("Jar invitations AFTER accept ", jar)
                  Jar.update({_id: invitation.jarId}, jar, function(err, updatedJar){
                    if(err){
                      return res.status(400).json(err, {message: "Jar Update failed after creating invited user"})
                    } else {
                      console.log("updated user is ", user, "updated Jar", updatedJar);
                      now = Date.now();
                      Invitation.findByIdAndUpdate({_id: invitation._id},{status: 'accepted', acceptedDate: now}, {new: true}, function(err, updatedInvitation){
                        if(err){
                          message = "Jar Update failed after creating invited user"
                          return res.status(400).json({err: err, message: message})
                        }
                        else{
                          User.findByIdAndUpdate(updatedInvitation.senderId,{$inc: {pendingInvitations: -1}},{new: true},function(err, updatedSender){
                            if(err){
                              message = "Sender pending count not reduced"
                              return res.status(400).json({err: err, message: message})
                            } else {
                              console.log("Invitation accepted", updatedInvitation, "Sender update ", updatedSender)
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
  email.send('julian.wyatt@1xdconsulting.co.uk', null, "Someone just registered on midnightmarmalade", "Hey Julian!\r\n\r\n Someone just registered on midnight marmalade.");
  var userConfirmation = new UserConfirmation();
  userConfirmation.userId = user._id;
  userConfirmation.userEmailAddress = user.email;
  userConfirmation.emailSent = Date.now()
  UserConfirmation.create(userConfirmation, function(err, confirmation){
    if(err){
      message = "UserConfirmation failed"
      return res.status(500).json({err: err, message: message })
    } else if (!confirmation){
      message = "UserConfirmation failed"
      return res.status(500).json({err: err, message: message })
    } else {
      var token = jwt.sign(payload, secret, { expiresIn: 60*60*2 });
      email.send(user.email,null,'Complete your registration with MidnightMarmalade',"Hey "+user.firstName+",\r\n\r\nThanks for registering with MidnightMarmalade the coolest new review site!\r\n\r\nTo confirm membership for "+user.firstName+" "+user.lastName+" please click this link https://midnightmarmala.de/userConfirmation/"+confirmation._id+" once clicked you will be able to log in and add your content, happy reviewing.\r\n\r\nThe Midnightmarmalade Team\r\n\r\nIf you didn't register for Midnightmaramalde please forward this email to julian@mg.midnightmarmala.de so that we can delete your email address from our system");
      return res.status(200).json({
      message: "Success",
      token: token
      })
    }
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