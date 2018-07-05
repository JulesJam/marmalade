var Location = require("../models/location");
var JarLocation = require("../models/jarLocation");
var Jar = require("../models/jar");
var User = require("../models/user");
var mongoose = require('mongoose');

function locationsCreate(req, res) {
  console.log("Current user is  >>>>",req.user);
  var receivedLocation = JSON.parse(req.body.location);
  //check if location already exists
  Location.find({googlePlacesId: receivedLocation.googlePlacesId}, function(err, locations){
    if (locations.length){
      console.log("The location already exists ", locations);
      console.log("checking location for jar", req.user.primaryJarId.jarId, " in '", locations[0].jars);
      console.log("does locations jars include this jar ", locations[0].jars.indexOf(req.user.primaryJarId.jarId));

      if(locations[0].jars.indexOf(req.user.primaryJarId.jarId) > -1){
         locationObjectId = mongoose.Types.ObjectId(locations[0]._id);
          console.log("location Object Id is ", locationObjectId);
          /*locationObjectId = locations[0]._id;*/
          JarLocation.find({location:{_id: locationObjectId}}, function(err, foundJarLocation){
            if(foundJarLocation){
              console.log("foundjar location is  ------->",foundJarLocation[0].entryType,"Recived location entry type is",receivedLocation.entryType);
              if (foundJarLocation[0].entryType === 'Wishlist' && receivedLocation.entryType === 'Recommendation'){
                console.log("JarLocation Entry type about to be updated");
                JarLocation.findByIdAndUpdate(foundJarLocation[0]._id,{entryType: "Recommendation"}, {new: true}, function(err, updatedFoundJarLocation){
                  if(err){
                    console.log("There was an error updating the JarLocation entry type")
                  } else if (updatedFoundJarLocation){
                    console.log("the jar location entry type is now ", updatedFoundJarLocation)
                  }
                })
              }
              console.log("Location is found");
            } else {
              console.log("error ", err);
            }
          })
          message = "Yes its there here it is";
        //will need to check if it is associated with the user
        return res.status(200).json({success: false, message: message, location: locations[0]})
        } else {
          //add it to teh jar
        console.log("need to add to jar");
        //first add location to the jar then add jarLocation
        var newJarLocation = new JarLocation();
        // need to creat a function for this to remove duplication
        newJarLocation.creatorId = req.user._id
        newJarLocation.jarId = req.user.primaryJarId.jarId;
        newJarLocation.branchCode = req.user.primaryJarId.branchCode;
        newJarLocation.location = locations[0]._id;
        newJarLocation.userIds = [req.user._id];
        newJarLocation.descriptions = [receivedLocation.description];
        newJarLocation.jarLocationType = receivedLocation.locationType;
        //newJarLocation.tags - not yet in use
        newJarLocation.views = [ Date.now()];
        //searchtye indicates whether person was near location when adding it
        newJarLocation.searchType = receivedLocation.searchType;
        newJarLocation.entryType = receivedLocation.entryType;
        if(receivedLocation.entryType == "Wishlist"){
          newJarLocation.source = receivedLocation.source
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
            message = "Jarlocation was not created"
            return res.status(500).json({ success: false, message: message })
          }

          Jar.findByIdAndUpdate(req.user.primaryJarId.jarId, {$push:{'jarLocations': jarLocation._id}}, {new: true}, function(err, updatedJar){
              if (err) {
                message = "Jarlocation adding to jar error"
                return res.status(500).json({ success: false, message: message, err: err})
              };
              if (!jarLocation) {
                message = "Jar was not added to jarlocation"
                return res.status(500).json({ success: false, message: message })
              };
              Location.findByIdAndUpdate(locations[0]._id, {$push:{'jars': updatedJar._id}}, {new: true}, function(err,updatedLocation){
                if(err){
                  message="Location did not have new jard details added";
                  return res.status(500).json({ success: false, message: message, err: err})

                } else if (!updatedLocation){
                  message = "Location was not updated with new JAr Location";
                  return res.status(500).json({ success: false, message: message })
                } else {
                  message = "Jar was not added to jarlocation"
                  return res.status(201).json({ success: true, location: updatedLocation })
                }
              })
              
          });
        })
      }
    
    } else {
      User.findById(receivedLocation.creatorId, function(err, user){
        if(err || !user){
          message = "Unable to locate user who created location ";
          return res.status(500).json({success: false, message: message, err: err})
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
          newJarLocation.descriptions = [receivedLocation.description];
          
          newJarLocation.jarLocationType = receivedLocation.locationType;
          //newJarLocation.tags - not yet in use
          newJarLocation.views = [ Date.now()];
          //searchtye indicates whether person was near location when adding it
          newJarLocation.searchType = receivedLocation.searchType;
          newJarLocation.entryType = receivedLocation.entryType;
          if(receivedLocation.entryType == "Wishlist"){
            newJarLocation.source = receivedLocation.source
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
                } else if(jarLocation){

                console.log('Jar updated to include jar location ', updatedJar)
                return res.status(201).json({ location : location})
              }
            });
            console.log("jarLocation",jarLocation);
            console.log("req.body",req.body);
            console.log("location",location);
          
          })
        })
      })
    }
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
