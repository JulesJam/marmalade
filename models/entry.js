var mongoose = require('mongoose');

var entrySchema = mongoose.Schema({
  creatorId: { type: mongoose.Schema.ObjectId, ref: "User", /*required: true */},
  locationId: { type: mongoose.Schema.ObjectId, ref: "Location" /*required: true*/},
  jarId: {type: mongoose.Schema.ObjectId, ref: "Jar"},
  description: { type: String},
  dateAdded: { type: Date, default: Date.now()},
  entryType: {type: String},//Restaurant coffee Shop etc
  tags: { type: String},
  active:{ type: Boolean, default: true},
  votes:{type: Number, default: 1},
  timesViewed:{type: Number, default: 1},
  view:[{type: Date, default: []}],
  verifiedDate:{type: Date},
  source: {tyep: String},
  upVotedBy:[{type: mongoose.Schema.ObjectId, ref: "User"}],
  downVotedBy:[{type: mongoose.Schema.ObjectId, ref: "User"}],
  hidden:{type: Boolean, default: false}
},{
  timestamps: true
});

entrySchema.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("Entry", entrySchema);