var mongoose = require('mongoose');

var userLocationSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "User", /*required: true */},
  locationId: { type: mongoose.Schema.ObjectId, ref: "Location" /*required: true*/},
  jarLocationId: {type: mongoose.Schema.ObjectId, ref: "Jar"},
  comments: [{ type: String, default: []}],//this is the user comment only seen by that user multiple comments allowed for revisits
  entryType: {type: String }, //wishlist or recommendation  
  source: {type: String},
  userTags: [{ type: String, default: []}],
  views:[{type: Date, default: []}],
  upVoted: {type: Boolean, deafult: false},
  downVoted:{type: Boolean, deafult: false},
},{
  timestamps: true
});

userLocationSchema.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("UserLocation", userLocationSchema);