var UserConfirmation = require('../models/userConfirmation');

function usersConfirmationCreate(req, res) {
  UserConfirmation.create(req.body, function(jar, err){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!jar) return res.status(500).json({ success: false, message: "Please provide user confirmation" });
    console.log("jar",jar);
    return res.status(200).json({userConfirmation})
    
  });
}


function usersConfirmationIndex(req, res) {
  UserConfirmation.find(function(err, users) {
    if(err) return res.status(500).json(err);
    return res.status(200).json(userConfirmations);
  });
}



function usersConfirmationShow(req, res) {
  UserConfirmation.findById(req.params.id, function(err, user) {
    if(err) return res.status(500).json(err);
    if(!user) return res.status(404).json({ message: "Could not find a user with that id" });
    return res.status(200).json(userConfirmation);
  });
}

function usersConfirmationUpdate(req, res) {
  UserConfirmation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }, function(err, user) {
    if(err) return res.status(400).json(err);
    return res.status(200).json(userConfirmation);
  });
}

function usersConfirmationDelete(req, res) {
  UserConfirmation.findByIdAndRemove(req.params.id, function(err) {
    if(err) return res.status(500).json(err);
    return res.status(204).send();
  });
}

module.exports = {
  create: usersConfirmationCreate,
  index: usersConfirmationIndex,
  show: usersConfirmationShow,
  update: usersConfirmationUpdate,
  delete: usersConfirmationDelete
}