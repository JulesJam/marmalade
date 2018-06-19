var Location = require("../models/location");

function locationsCreate(req, res) {



  newLocation = JSON.parse(req.body.location);
  console.log("File Key>>>>>>>>>>>",req.file);
  if (req.file && req.file.key){
      newLocation.locationMainImage = req.file.key
    }
  Location.create(newLocation, function(err, location){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!location) return res.status(500).json({ success: false, message: "Please provide a location" });
    console.log("req.body",req.body);
    console.log("location",location);
    return res.status(201).json({ location : location});
  });
}

function locationsIndex(req,res){
  query = req.query;
  console.log("Query",query);
  console.log("Logged In User",req.user);
  Location.find(query, function(err, location){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!location) return res.status(500).json({ success: false, message: "No Locations Found" });
    return res.status(200).json({ location : location});
  })
}

function locationsShow(req,res){
  Location.findById(req.params.id, function(err, location){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!location) return res.status(500).json({ success: false, message: "No Location Found" });
    return res.status(200).json({ location : location});
  })
}

function locationsUpdate(req,res){
  Location.findByIdAndUpdate(req.params.id, req.body, {new : true}, function(err, location){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!location) return res.status(500).json({ success: false, message: "No Data to Update Found" });
    console.log("update just run ", req.body)
    return res.status(200).json({ location : location});
  })
}

function locationsDelete(req,res){
  Location.findByIdAndRemove(req.params.id, function(err, location){
    if(err) return res.status(500).json(err);
    if(!location) return res.status(500).json({ sucess: false, message: "Location does not exist cannot delete"})
    return res.status(204).send({message: "DELETED"});
  })
}


module.exports = {
  create: locationsCreate,
  index: locationsIndex,
  show: locationsShow,
  update: locationsUpdate,
  delete: locationsDelete

};
