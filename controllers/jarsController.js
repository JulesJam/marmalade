var Jar = require("../models/jar");
var User = require('../models/user');

function jarsCreate(req, res) {
  Jar.create(req.body, function(jar, err){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!jar) return res.status(500).json({ success: false, message: "Please provide a jar" });
    console.log("newJar",newJar);
    console.log("jar",jar);
    return res.status(200).json({jar})
    
  });
}

function jarsIndex(req,res){
  query = req.query;
  console.log("Query",query);
  console.log("Logged In User",req.user);
  Jar.find(query, function(err, jar){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!jar) return res.status(500).json({ success: false, message: "No Jars Found" });
    return res.status(200).json({ jars});
  })
}

function jarsShow(req,res){
  console.log("looking for jar ", req.params.id);
  Jar.findById(req.params.id)
    .populate (
      {path: 'jarLocations',
      populate: {path: 'location'}
    })
    .then( function(jar, err){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!jar) return res.status(500).json({ success: false, message: "No Jar Found" });
    return res.status(200).json({ jar : jar});
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function jarsUpdate(req,res){
  Jar.findByIdAndUpdate(req.params.id, req.body, {new : true}, function(jarr, err){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!jar) return res.status(500).json({ success: false, message: "No Data to Update Found" });
    console.log("update just run ", req.body)
    return res.status(200).json({ jar : jar});
  })
}

function jarsDelete(req,res){
  Jar.findByIdAndRemove(req.params.id, function(jar, err){
    if(err) return res.status(500).json(err);
    if(!jar) return res.status(500).json({ sucess: false, message: "Jar does not exist cannot delete"})
    return res.status(204).send({message: "DELETED"});
  })
}

function getChildCode(sender){
  Jar.findById(sender.primaryJarId.jarId, function(jar, err){  
    if (err) return res.status(500).json({ success: false, err: err, message: "Unable to get childcode for invitaion"});
    if (jar){
      jar.childCodeTracker +=1;
      sender.jarMembership.branchCode.push(jar.childCodeTracker);
      jar.treeManager.branchCode.push({branchCode:[sender.jarMembership.branchCode], members: []});
      Jar.update(jarId, jar, function(err, jar){
        if (err) return res.status(500).json({ success: false, err: err, message: "Unable to save new childcode for invitaion"})
          return jar
        
      })
    }
  })
}


module.exports = {
  create: jarsCreate,
  index: jarsIndex,
  show: jarsShow,
  update: jarsUpdate,
  delete: jarsDelete

};
