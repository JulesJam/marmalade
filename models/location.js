var mongoose = require('mongoose');



var locationSchema = mongoose.Schema({
  creatorId: { type: mongoose.Schema.ObjectId, ref: "User", /*required: true */},
  locationName: { type: String, /*required: true*/},
  locationTown: { type: String, /*required: true*/},
  locationAddress: { type: String },
  locationMainTelephone: { type: String },
  locationPostcode: { type: String},
  coordinates: [{type: Number}],
  locationCountry: { type: String},
  website: {type: String},
  googlePlacesId: {type: String},
  googleImageUrl: {type: String},
  googlePlaceType: {type: String},
  officialDescription: { type: String},
  dateAdded: { type: Date, default: Date.now},
  authorisedImage: { type: String},
  authorisedSubImages: [{ type: String, default: [] }],
  locationMainImage: {type: String},
  views: [{type: Date, default: Date.now}],
  active:{ type: Boolean, default: true},//this will remove from all jars if admin needs to remove
  votes:{type: Number, default: 1},
  jars: [{type: mongoose.Schema.ObjectId, ref: "Jar", default: []}]//aggregate across all jars but don't use yet
},{

  timestamps: true

});


locationSchema.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("Location", locationSchema);