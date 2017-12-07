var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
  locationName: { type: String, required: true},
  description: { type: String},
  dateAdded: { type: Date},
  tag: { type: String},
  lat: { type: String},
  long:{ type: String},
  active:{ type: Boolean}
},{

  timestamps: true

});

locationSchema.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("Location", locationSchema);