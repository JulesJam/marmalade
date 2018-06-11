var Invitation = require("../models/invitation");
var Invitation = require("../models/invitation");
var User = require('../models/user');

function invitationsCreate(req, res) {
  Invitation.create(req.body, function(err, invitation){
    console.log("Api receiving invitation ", req.body)
    if (err) return res.status(500).json({ success: false, message: err});
    if (!invitation) return res.status(500).json({ success: false, message: "Please provide an invitation" });
    
    console.log("invitation",invitation);
    return res.status(200).json({invitation})
    
  });
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


module.exports = {
  create: invitationsCreate,
  index: invitationsIndex,
  show: invitationsShow,
  update: invitationsUpdate,
  delete: invitationsDelete

};
