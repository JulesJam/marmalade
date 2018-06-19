var Entry = require("../models/entry");

function entrysCreate(req, res) {



  newEntry = JSON.parse(req.body.entrys);
  console.log("File Key>>>>>>>>>>>",req.file);
  if (req.file && req.file.key){
      newEntry.entrysMainImage = req.file.key
    }
  Entry.create(newEntry, function(err, entrys){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!entrys) return res.status(500).json({ success: false, message: "Please provide an entrysDelete" });
    console.log("req.body",req.body);
    console.log("entrys",entrys);
    return res.status(201).json({ entrys : entrys});
  });
}

function entrysIndex(req,res){
  query = req.query;
  console.log("Query",query);
  console.log("Logged In User",req.user);
  Entry.find(query, function(err, entrys){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!entrys) return res.status(500).json({ success: false, message: "No Entrys Found" });
    return res.status(200).json({ entrys : entrys});
  })
}

function entrysShow(req,res){
  Entry.findById(req.params.id, function(err, entrys){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!entrys) return res.status(500).json({ success: false, message: "No Entry Found" });
    return res.status(200).json({ entrys : entrys});
  })
}

function entrysUpdate(req,res){
  Entry.findByIdAndUpdate(req.params.id, req.body, {new : true}, function(err, entrys){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!entrys) return res.status(500).json({ success: false, message: "No Data to Update Found" });
    console.log("update just run ", req.body)
    return res.status(200).json({ entrys : entrys});
  })
}

function entrysDelete(req,res){
  Entry.findByIdAndRemove(req.params.id, function(err, entrys){
    if(err) return res.status(500).json(err);
    if(!entrys) return res.status(500).json({ sucess: false, message: "Entry does not exist cannot delete"})
    return res.status(204).send({message: "DELETED"});
  })
}


module.exports = {
  create: entrysCreate,
  index: entrysIndex,
  show: entrysShow,
  update: entrysUpdate,
  delete: entrysDelete

};
