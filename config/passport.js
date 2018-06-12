var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Jar = mongoose.model('Jar');
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
     } else if (user){

      Jar.findById(user.primaryJarId.jarId, function(err, jar){
        if(err) res.send(500).json(err);
        if(!jar){
          return done(null, false, "There is an error with jar linking");
        } else if (jar){
            var payload = { 
            _id: user._id,
            firstName: user.firstName,
            lastName:  user.lastName,
            primaryJarId: user.primaryJarId.jarId,
            primaryJarMembershipLevel: user.primaryJarId.membershipLevel,
            primaryJarBranchCode: user.primaryJarId.branchCode,
            primaryJarChildCode: user.primaryJArId.childCode,
            jarOwnerJarId: user.jarOwnerJarId,
            jarName: jar.jarName 
            };

             var token = jwt.sign(payload, secret, { expiresIn: 60*60*2 });
             console.log("Generating token...",token);
             /*return res.status(200).json({
               message: "Success",
               token: token
             });*/
             return done(null, user, token
              )
          }
        })
      }
     })
   })
);