var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
  locationName: { type: String, required: true},
  locationTown: { type: String, required: true},
  locationPostcode: { type: String},
  locationCountry: { type: String, default: "UK"},
  description: { type: String},
  dateAdded: { type: Date, default: Date.now},
  locationMainImage: {type: String},
  tag: { type: String},
  lat: { type: String},
  long:{ type: String},
  active:{ type: Boolean}
},{

  timestamps: true

});

locationSchema.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("Location", locationSchema);