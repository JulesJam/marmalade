var Image = require("../models/image");

function imagesCreate(req, res) {
  Image.create(req.body.body, function(err, image){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!image) return res.status(500).json({ success: false, message: "Please provide an image" });
    console.log("req.body",req.body);
    console.log(image);
    return res.status(201).json({ image : image});
  });
}

function imagesIndex(req,res){
  query = req.query;
  console.log("Query",query);
  Image.find(query, function(err, images){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!images) return res.status(500).json({ success: false, message: "No Images Found" });
    return res.status(200).json({ images : images});
  })
}

function imagesShow(req,res){
  Image.findById(req.params.id, function(err, image){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!image) return res.status(500).json({ success: false, message: "No Image Found" });
    return res.status(200).json({ image : image});
  })
}

function imagesUpdate(req,res){
  Image.findByIdAndUpdate(req.params.id, req.body.image, {new : true}, function(err, image){
    if (err) return res.status(500).json({ success: false, message: err});
    if (!image) return res.status(500).json({ success: false, message: "No Data to Update Found" });
    return res.status(200).json({ image : image});
  })
}

function imagesDelete(req,res){
  Image.findByIdAndRemove(req.params.id, function(err, image){
    if(err) return res.status(500).json(err);
    if(!image) return res.status(500).json({ sucess: false, message: "Image does not exist cannot delete"})
    return res.status(204).send({message: "DELETED"});
  })
}


module.exports = {
  create: imagesCreate,
  index: imagesIndex,
  show: imagesShow,
  update: imagesUpdate,
  delete: imagesDelete

};
