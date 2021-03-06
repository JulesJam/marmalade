var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var beautifulUnique = require('mongoose-beautiful-unique-validation');

var jarMembership = new mongoose.Schema ({
  jarId: {
    type: mongoose.Schema.ObjectId,
    ref: "Jar_id",
    required: true
  },
  membershipLevel: {
    type: Number,
    required: true
  },
  branchCode: [{
    type: Number,
  }],
  childCode: {
    type: Number,
    default: null
  }
})

var userSchema = new mongoose.Schema({
  email:{
  type: String,
  required: true,
  unique: true
  },
  firstName:{
    type: String,
    required: true
  },
  lastName:{
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
  },
  contactConsent: {
    type: Boolean,
    required: true
  },
  contactConsentDateSet: {
    type: Date,
    default: Date.now
  },
  marketingConsent: {
    type: Boolean,
    required: true
  },
  marketingConsentDateSet: {
    type: Date,
    default: Date.now
  },
  inviteCode: {
    type: String
  },
  jarOwnerJarId: {
    type: mongoose.Schema.ObjectId,
    ref: "Jar",
  },
  primaryJarId: {
    type: jarMembership
  },
  jarMemberships: [{
    type: jarMembership
  }],
  isActivated: {
    type: Boolean,
    default: false
  },
  visits: [{
    type: Date,
    default: Date.now
  }],
  friends: [{
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }],
  invitations:[{
    type: mongoose.Schema.ObjectId,
    ref: "Invitaion",
    default:[]
  }],
  pendingInvitations:{
    type: Number,
    default: 0
  },
  avatar: {
    type: String
  },
  createdAt: { type: Date, default:  Date.now},
  updatedAt: { type: Date, default: Date.now}
});

userSchema.set('toJSON', {
  transform: function(document, json){
    delete json.passwordHash;
    delete json.__v;
    return json;
    }
});

userSchema.pre("validate", function(next) {
  if(!this._password) {
    this.invalidate('password', 'A password is required');
    console.log("password validation failed");
  }
  next();
});




userSchema.virtual('password')
  .set(function (password) {
    this._password = password;
    this.passwordHash =bcrypt.hashSync(this._password, bcrypt.genSaltSync(10));
});

userSchema.virtual('passwordConfirmation')
  .get(function(){
    return this._passwordConfirmation
  })
  .set(function(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
});

userSchema.path('passwordHash')
  .validate(function(passwordHash){
    if(this.isNew){
      if(!this._password){
        return this.invalidate('password', 'A password is required');
      }

      if(this._password !== this._passwordConfirmation){
        return this.invalidate('passwordConfirmation', 'Passwords do not match');
      }
    }
});


userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.plugin(beautifulUnique);

module.exports = mongoose.model('User', userSchema);

