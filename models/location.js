var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
  creatorId: { type: mongoose.Schema.ObjectId, ref: "User", /*required: true */},
  locationName: { type: String, /*required: true*/},
  locationTown: { type: String, /*required: true*/},
  locationAddress: { type: String },
  locationMainTelephone: { type: String },
  locationPostcode: { type: String},
  latitude: { type: Number},
  longitude: { type: Number },
  locationCountry: { type: String},
  website: {type: String},
  googlePlacesId: {type: String},
  googleImageUrl: {type: String},
  googlePlaceType: {type: String},
  officialDescription: { type: String},
  dateAdded: { type: Date, default: Date.now},
  pictures: [{ type: String, required: true }],
  locationMainImage: {type: String},
  locationType: {type: String},
  entryType: {type: String},//Restaurant coffee Shop etc
  lat: { type: String},
  long:{ type: String},
  active:{ type: Boolean, default: true},
  votes:{type: Number, default: 1}
},{

  timestamps: true

});

locationSchema.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("Location", locationSchema);