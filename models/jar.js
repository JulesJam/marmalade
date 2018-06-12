var mongoose = require('mongoose');


var treeManager = new mongoose.Schema({
  branchCode: [{type: Number, required: true, default: ''}],
  members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});

var jarSchema = mongoose.Schema({
  treeManager: [{ type: treeManager }],
  childCodeTracker: { type: Number, default: 0},
  creatorId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  jarName: { type: String, required: true, require: true},
  jarIcon: { type: String},
  members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  invites: [{ type: String }],
  locations: [{ type: String}],
  last_updated: {type: Date, default: Date.now }
},{

  timestamps: true

});

jarSchema.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("Jar", jarSchema);