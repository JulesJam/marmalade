var UserLocation = require("../models/userLocation");

function userLocationsCreate(req, res) {
  newUserLocation = JSON.parse(req.body.userLocations);
  console.log("File Key>>>>>>>>>>>",req.file);
  if (req.file && req.file.key){
      newUserLocation.userLocationsMainImage = req.file.key
    }
  UserLocation.create(newUserLocation, function(err, userLocations){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!userLocations) return res.status(500).json({ success: false, message: "Please provide an userLocationsDelete" });
    console.log("req.body",req.body);
    console.log("userLocations",userLocations);
    return res.status(201).json({ userLocations : userLocations});
  });
}

function userLocationsIndex(req,res){
  query = req.query;
  console.log("Query",query);
  console.log("Logged In User",req.user);
  UserLocation.find(query, function(err, userLocations){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!userLocations) return res.status(500).json({ success: false, message: "No UserLocations Found" });
    return res.status(200).json({ userLocations : userLocations});
  })
}

function userLocationsShow(req,res){
  UserLocation.findById(req.params.id, function(err, userLocations){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!userLocations) return res.status(500).json({ success: false, message: "No UserLocation Found" });
    return res.status(200).json({ userLocations : userLocations});
  })
}

function userLocationsUpdate(req,res){
  UserLocation.findByIdAndUpdate(req.params.id, req.body, {new : true}, function(err, userLocations){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!userLocations) return res.status(500).json({ success: false, message: "No Data to Update Found" });
    console.log("update just run ", req.body)
    return res.status(200).json({ userLocations : userLocations});
  })
}

function userLocationsDelete(req,res){
  UserLocation.findByIdAndRemove(req.params.id, function(err, userLocations){
    if(err) return res.status(500).json(err);
    if(!userLocations) return res.status(500).json({ sucess: false, message: "UserLocation does not exist cannot delete"})
    return res.status(204).send({message: "DELETED"});
  })
}


module.exports = {
  create: userLocationsCreate,
  index: userLocationsIndex,
  show: userLocationsShow,
  update: userLocationsUpdate,
  delete: userLocationsDelete

};
