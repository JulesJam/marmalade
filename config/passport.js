var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var secret = process.env.MARMALADE_API_SECRET;

passport.use(new LocalStrategy({
    usernameField: 'email'
    
  },

  function(username, password, done) {
  console.log("trying to use...", username);
   User.findOne({ email: username}, function(err, user) {

     if(err) res.send(500).json(err);
     if(!user || !user.validatePassword(/*req.body.*/password)) {
      return done(null, false, "User details not valid");
     }

     var payload = { _id: user._id, username: user.username };
     var token = jwt.sign(payload, secret, { expiresIn: 60*60*24 });
     console.log("Generating token...",token);
     /*return res.status(200).json({
       message: "Success",
       token: token
     });*/
     return done(null, user, token
      )
   });
  }
));