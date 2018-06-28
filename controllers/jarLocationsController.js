var JarLocation = require("../models/jarLocation");

function jarLocationsCreate(req, res) {
  newJarLocation = JSON.parse(req.body.jarLocations);
  console.log("File Key>>>>>>>>>>>",req.file);
  if (req.file && req.file.key){
      newJarLocation.jarLocationsMainImage = req.file.key
    }
  JarLocation.create(newJarLocation, function(err, jarLocations){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!jarLocations) return res.status(500).json({ success: false, message: "Please provide an jarLocationsDelete" });
    console.log("req.body",req.body);
    console.log("jarLocations",jarLocations);
    return res.status(201).json({ jarLocations : jarLocations});
  });
}


//this needs checking out
function jarLocationsIndex(req,res){
  JarLocation.find()
    .then(function(jarLocation) {
      console.log("I have found this jar location ",jarLocation)
      return res.status(200).json(jarLocation)
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function jarLocationsShow(req,res){
  JarLocation.findById(req.params.id, function(err, jarLocations){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!jarLocations) return res.status(500).json({ success: false, message: "No JarLocation Found" });
    return res.status(200).json({ jarLocations : jarLocations});
  })
}

function jarLocationsUpdate(req,res){
  JarLocation.findByIdAndUpdate(req.params.id, req.body, {new : true}, function(err, jarLocations){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!jarLocations) return res.status(500).json({ success: false, message: "No Data to Update Found" });
    console.log("update just run ", req.body)
    return res.status(200).json({ jarLocations : jarLocations});
  })
}

function jarLocationsDelete(req,res){
  JarLocation.findByIdAndRemove(req.params.id, function(err, jarLocations){
    if(err) return res.status(500).json(err);
    if(!jarLocations) return res.status(500).json({ sucess: false, message: "JarLocation does not exist cannot delete"})
    return res.status(204).send({message: "DELETED"});
  })
}


module.exports = {
  create: jarLocationsCreate,
  index: jarLocationsIndex,
  show: jarLocationsShow,
  update: jarLocationsUpdate,
  delete: jarLocationsDelete

};
