var UserConfirmation = require('../models/userConfirmation');
var User = require('../models/user');
var email = require('../config/email');

function userConfirmationsCreate(req, res) {
  UserConfirmation.create(req.body, function(jar, err){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!jar) return res.status(500).json({ success: false, message: "Please provide user confirmation" });
    console.log("jar",jar);
    return res.status(200).json({userConfirmation})
    
  });
}


function userConfirmationsIndex(req, res) {
  UserConfirmation.find(function(err, users) {
    if(err) return res.status(500).json(err);
    return res.status(200).json(userConfirmations);
  });
}



/*function userConfirmationsShow(req, res) {
  UserConfirmation.findById(req.params.id, function(err, user) {
    if(err) return res.status(500).json(err);
    if(!user) return res.status(404).json({ message: "Could not find a user with that id" });
    return res.status(200).json(userConfirmation);
  });
}
*/
function userConfirmationsUpdate(req, res) {
  UserConfirmation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }, function(err, user) {
    if(err) return res.status(400).json(err);
    return res.status(200).json(userConfirmation);
  });
}

function userConfirmationsDelete(req, res) {
  UserConfirmation.findByIdAndRemove(req.params.id, function(err) {
    if(err) return res.status(500).json(err);
    return res.status(204).send();
  });
}

function userConfirmationsShow(req, res) {
  console.log("looking for cnfirmtion");
  UserConfirmation.findById(req.params.id, function(err, userConfirmation){
    if(err) return res.status(500).json({success: false, error: err, message: "There was an error retrieving that user confirmation record"});
    if(!userConfirmation) return res.status(404).json({success: false, message: "The confirmation record could not be found"});
    User.findByIdAndUpdate({_id: userConfirmation.userId},{isAvtivated: true}, {new: true}, function(err, updatedUser){
      var message = "Failed to find user with confirmation ID "+req.params.id;
      if(err) return res.status(500).json({success: false, err: err, message: message});
      if(!updatedUser) return res.status(404).json({success: false, err: err, message: message});
        message = "Hey "+updatedUser.firstName+"\r\n\r\nThanks for confirming your email, now you are all set to add your new entries to your MidnightMarmalade jar, remember you can also now invite your friends to join the jar by using the send an invitation link.\r\n\r\nThe MidnightMarmalade Team";
      email.send(updatedUser.email, null, "Account verified", message);
      message = "Thanks you have validated your account and can now add content please log in using "+updatedUser.email
      return res.status(200).json({success: true, message: message})
    })

  });
}

module.exports = {
  create: userConfirmationsCreate,
  index: userConfirmationsIndex,
  show: userConfirmationsShow,
  update: userConfirmationsUpdate,
  delete: userConfirmationsDelete,
 /* accept: userConfirmationsAccept*/
}