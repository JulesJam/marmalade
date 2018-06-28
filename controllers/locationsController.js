var Location = require("../models/location");
var JarLocation = require("../models/jarLocation");
var Jar = require("../models/jar");
var User = require("../models/user");

function locationsCreate(req, res) {
  console.log("Current user is  >>>>",req.user);
  var receivedLocation = JSON.parse(req.body.location);
  //check if location already exists
  Location.find({googlePlacesId: receivedLocation.googlePlacesId}, function(err, locations){
    if (locations.length){
      console.log("The location already exists ")
      //now check is it in the jar if no add to jar routine
      //if yes add to user routine
      message = "The location is already in the system";
      return res.status(409).json({success: false, message: message})
    };

    User.findById(receivedLocation.creatorId, function(err, user){
      if(err || !user){
        message = "Unable to locate user who created location ";
        return res.status(500).json({success: flase, message: message, err: err})
      }

      var newLocation = new Location();
        // here need to create location then run
        //add to jar routine
        //and run add to user routine


      newLocation.creatorId = user._id

      console.log('receivedLocation is >>>>> ', receivedLocation);
      newLocation.locationName = receivedLocation.locationName;
      newLocation.locationTown = receivedLocation.locationTown;
      newLocation.locationAddress = receivedLocation.locationAddress;
      newLocation.locationMainTelephone = receivedLocation.locationMainTelephone;
      newLocation.locationPostcode = receivedLocation.locationPostcode;
      newLocation.coordinates = receivedLocation.coordinates;
      newLocation.locationCountry = receivedLocation.locationCountry;
      newLocation.website = receivedLocation.website;
      newLocation.googlePlacesId = receivedLocation.googlePlacesId;
      newLocation.googlePlaceTypes = receivedLocation.googlePlaceTypes;
      newLocation.officialDescription = '';
      newLocation.authorisedImage = '';
      newLocation.authorisedSubImages = [];
      newLocation.views = [ Date.now()];
      newLocation.active = true;
      newLocation.jars = [user.primaryJarId.jarId];

          /*description: 'Pubby pub',
          entryType: 'Recommendation',
          source: null,
          locationType: 'Pub',
          locationMainImage: null,
          searchType: 'local',*/


      console.log("File Key>>>>>>>>>>>",req.file);
      if (req.file && req.file.key){
        newLocation.locationMainImage = req.file.key
      }
      Location.create(newLocation, function(err, location){
        if (err) return res.status(500).json({ success: false, message: err});
        if (!location)return res.status(500).json({ success: false, message: "The location failed to save" })
        //create a jar entry
        var newJarLocation = new JarLocation();

        newJarLocation.creatorId = user._id;
        newJarLocation.jarId = user.primaryJarId.jarId;
        newJarLocation.branchCode = user.primaryJarId.branchCode;
        newJarLocation.location = location._id;
        newJarLocation.userIds = [user._id];
        newJarLocation.description = [receivedLocation.description];
        newJarLocation.jarLocationType = receivedLocation.locationType;
        //newJarLocation.tags - not yet in use
        newJarLocation.views = [ Date.now()];
        //searchtye indicates whether person was near location when adding it
        newJarLocation.searchType = receivedLocation.searchType;
        if(receivedLocation.entryType){
          newJarLocation.source = receivedLocation.entryType
          }
        else {
          newJarLocation.source = "Recommendation";
        };
        newJarLocation.upVotedBy = [];
        newJarLocation.downVotedBy = [];
        console.log("New JarLocation is ...", newJarLocation);
        JarLocation.create(newJarLocation, function(err, jarLocation){
          if (err) {
            message = "Jar loctaion creation error"
            return res.status(500).json({ success: false, message: message, err: err})
          };
          if (!jarLocation) {
            message = "Jarlocation wa snot created"
            return res.status(500).json({ success: false, message: message })
          }

          Jar.findByIdAndUpdate(user.primaryJarId.jarId, {$push:{'jarLocations': jarLocation._id}}, {new: true}, function(err, updatedJar){
              if (err) {
                message = "Jarlocation adding to jar error"
                return res.status(500).json({ success: false, message: message, err: err})
              };
              if (!jarLocation) {
                message = "Jar was not added to jarlocation"
                return res.status(500).json({ success: false, message: message })
              }

              console.log('Jar updated to include jar location ', updatedJar)
              return
          });
          console.log("jarLocation",jarLocation);
          console.log("req.body",req.body);
          console.log("location",location);
          return res.status(201).json({ location : location});
        })
      })
    })
  })
}



function locationsIndex(req,res){
  query = req.query;
  console.log("Query",query);
  console.log("Logged In User",req.user);
  Location.find(query, function(err, locations){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!locations) return res.status(500).json({ success: false, message: "No Locations Found" });
    return res.status(200).json({ locations : locations});
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
