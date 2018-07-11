var Invitation = require("../models/invitation");
var Invitation = require("../models/invitation");
var User = require('../models/user');
var Jar = require('../models/jar');
var email = require('../config/email');

function invitationsCreate(req, res) {
  User.findById(req.body.senderId, function(err, sender){
    var message = "Triend to find user"+req.body.senderId;

    if (err) return res.status(500).json({ success: false, message: message })
    if (sender){
      if (!sender.primaryJarId.childCode){
        getChildCode(sender, res)
          .then(
            (jar)=>{
            Jar.findByIdAndUpdate({_id: jar._id}, jar, {new: true}, function(err, updatedJar){
              console.log("updatedJar Found for invite @@@@@ ", updatedJar);
              console.log("updatedJar childcode ", updatedJar.childCodeTracker/*, " sender branchcode ", sender.primaryJarId.branchCode*/);
              sender.primaryJarId.childCode = updatedJar.childCodeTracker;
              sender.primaryJarId.branchCode = updatedJar.treeManager[updatedJar.childCodeTracker].branchCode;
              console.log("sender is now tracker 2", sender);
              User.findByIdAndUpdate({_id: sender._id}, sender,{new: true}, function(err, sender){
              if (err) return res.status(500).json({ success: false, err: err, message: "failed to update user new branch child code"});
              if (sender){
                finaliseNewInvitation(sender,req,res);
              }
              });
            })
          })
        .catch(console.log("error handler should do this"))
      } else {
        finaliseNewInvitation(sender,req,res);
      }
    }
  })
}

function invitationsIndex(req,res){
  query = req.query;
  console.log("Query",query);
  console.log("Logged In User",req.user);
  Invitation.find(query, function(err, invitation){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!invitation) return res.status(500).json({ success: false, message: "No invitations Found" });
    return res.status(200).json({ invitations});
  })
}

function invitationsShow(req,res){
  Invitation.findById(req.params.id, function(err, invitation){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!invitation) return res.status(500).json({ success: false, message: "No Invitation Found" });
    return res.status(200).json({ invitation : invitation});
  })
}

function invitationsUpdate(req,res){
  Invitation.findByIdAndUpdate(req.params.id, req.body, {new : true}, function(err, invitation){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!invitation) return res.status(500).json({ success: false, message: "No Data to Update Found" });
    console.log("update just run ", req.body)
    return res.status(200).json({ invitation : invitation});
  })
}

function invitationsDelete(req,res){
  Invitation.findByIdAndRemove(req.params.id, function(err, invitation){
    if(err) return res.status(500).json(err);
    if(!invitation) return res.status(500).json({ sucess: false, message: "Invitation does not exist cannot delete"})
    return res.status(204).send({message: "DELETED"});
  })
}

function getChildCode(sender, res){
  return new Promise ((resolve, reject) =>{
    console.log("tryig to get jar with Id .......",sender.primaryJarId.jarId)
    Jar.findById(sender.primaryJarId.jarId, function(err, jar){  
      if (err) return res.status(500).json({ success: false, err: err, message: "Unable to get childcode for invitaion"});
      if (jar){
        jar.childCodeTracker += 1;
        console.log("NEW CHILDCODE TRACKER IS",jar.childCodeTracker)
        sender.primaryJarId.branchCode.push(jar.childCodeTracker);
        newBranch = {branchCode: sender.primaryJarId.branchCode , members: []}
        console.log("JAR IS>>> ",jar,"trying to push ", jar.treeManager, "new branch",
        newBranch )
        jar.treeManager.push(newBranch);
        console.log("new jar tree manager ----> ",jar.treeManager)
        resolve(jar)
      }
      else{
        reject (
          console.log("oops something going wroong"))
      }
    })
  })
}

function finaliseNewInvitation (sender, req, res){
  newInvitation = {
  senderId: req.body.senderId,
  jarId: sender.primaryJarId.jarId,
  recipientEmailAddress: req.body.recipientEmailAddress,
  recipientFirstName: req.body.recipientFirstName,
  invitationMembershipLevel: sender.primaryJarId.membershipLevel+1,
  invitationBranchCode: sender.primaryJarId.branchCode,
  invitationChildCode: sender.primaryJarId.childCode,
  emailSentDate: req.body.emailSentDate,
  acceptedDate: null,
  rejectDate: null,
  status: 'Pending'
  };
  console.log("Api receiving invitation ", newInvitation)
  Invitation.create(newInvitation, function(err, invitation){
    console.log("Api saved invitation ", invitation)
    if (err){
      message = "Invitation failed to create"
      return res.status(500).json({ success: false, err: err, message: message});
    } 
    if (!invitation) return res.status(500).json({ success: false, message: "Please provide an invitation" });
    Jar.findByIdAndUpdate(invitation.jarId, {$addToSet: {invitations: invitation._id}}, {new: true}, function(err, jar){
      if(err){
        message = "Invite failed to save to jar";
        return res.status(500).json({ success: false, err: err, message: message});
      } else {
        User.findByIdAndUpdate(invitation.senderId,{
          $addToSet: {invitations: invitation._id},
          $inc: {pendingInvitations: 1 }
          },
          {new: true}, function(err, updatedUser){
          if(err){
            message = "Invite failed to update to user";
            return res.status(500).json({ success: false, err: err, message: message});
          } else {
            console.log("invitation",invitation, "Jar has been updated to ", jar, "invite added to sender ", updatedUser);
            email.send(newInvitation.recipientEmailAddress, "Your invitation code is "+invitation._id);
            return res.status(200).json({invitation})
          } 
        })
      }
    })
    
  });

}




module.exports = {
  create: invitationsCreate,
  index: invitationsIndex,
  show: invitationsShow,
  update: invitationsUpdate,
  delete: invitationsDelete

};
