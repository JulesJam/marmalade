var Jar = require("../models/jar");
var User = require('../models/user')

function jarsCreate(req, res, user) {
  newJar = new Jar();
  newJar.jarName = req.body.jarName;
  newJar.creatorId = user._id;
  newJar.members.push(user._id);

  Jar.create(newJar, function(err, jar){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!jar) return res.status(500).json({ success: false, message: "Please provide a jar" });
    console.log("newJar",newJar);
    console.log("jar",jar);
    
  });
}

function jarsIndex(req,res){
  query = req.query;
  console.log("Query",query);
  console.log("Logged In User",req.user);
  Jar.find(query, function(err, jar){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!jar) return res.status(500).json({ success: false, message: "No Jars Found" });
    return res.status(200).json({ jar : jar});
  })
}

function jarsShow(req,res){
  Jar.findById(req.params.id, function(err, jar){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!jar) return res.status(500).json({ success: false, message: "No Jar Found" });
    return res.status(200).json({ jar : jar});
  })
}

function jarsUpdate(req,res){
  Jar.findByIdAndUpdate(req.params.id, req.body, {new : true}, function(err, jar){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!jar) return res.status(500).json({ success: false, message: "No Data to Update Found" });
    console.log("update just run ", req.body)
    return res.status(200).json({ jar : jar});
  })
}

function jarsDelete(req,res){
  Jar.findByIdAndRemove(req.params.id, function(err, jar){
    if(err) return res.status(500).json(err);
    if(!jar) return res.status(500).json({ sucess: false, message: "Jar does not exist cannot delete"})
    return res.status(204).send({message: "DELETED"});
  })
}


module.exports = {
  create: jarsCreate,
  index: jarsIndex,
  show: jarsShow,
  update: jarsUpdate,
  delete: jarsDelete

};
