var s3 = require('./s3');
var multer = require ('multer');
var multerS3 = require ('multer-s3');
var sharp = require ('sharp');
var uuid = require('uuid');


module.exports = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.MARMALADE_AWS_BUCKET,
    key: function (req, file, cb) {
        var ext = '.' + file.originalname.split('.').splice(-1)[0];
        console.log("extension", ext);
        var filename = uuid.v1()+'-orig' + ext;
        cb(null, filename)
    }

    /*shouldTransform: function (req, file, cb) {
         cb(null, /^image/i.test(file.mimetype))
       },
    transforms: [{
        id: 'original',
        key: function (req, file, cb) {
            var ext = '.' + file.originalname.split('.').splice(-1)[0];
            console.log("extension", ext);
            var filename = uuid.v1()+'-orig' + ext;
            cb(null, filename)
        },
        transform: function (req, file, cb) {
            cb(null, sharp().resize(600,600).max())
        }
      }, {
        id: 'thumbnail',
        key: function (req, file, cb) {
          var ext = '.' + file.originalname.split('.').splice(-1)[0];
          var filename = uuid.v1()+'-thumb' + ext;
        cb(null, filename)
        },
        transform: function (req, file, cb) {
        cb(null, sharp().resize(100, 100).max())
        }
      },
      {
        id: 'main',
        key: function (req, file, cb) {
          var ext = '.' + file.originalname.split('.').splice(-1)[0];
          var filename = uuid.v1()+'-main' + ext;
        cb(null, filename)
        },
        transform: function (req, file, cb) {
        cb(null, sharp().resize(400, 400).max())
        }
      }
    ]*/

  })
});