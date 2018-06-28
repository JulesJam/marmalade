var mongoose = require('mongoose');


var treeManager = new mongoose.Schema({
  branchCode: [{type: Number, required: true}],
  members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});

var jarSchema = mongoose.Schema({
  treeManager: [{ type: treeManager }],
  childCodeTracker: { type: Number, default: 0},
  creatorId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  jarName: { type: String, required: true, require: true},
  jarIcon: { type: String},
  members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  invitations: [{ type: mongoose.Schema.ObjectId, ref: "Invitation", default: [] }],
  jarLocations: [{type: mongoose.Schema.ObjectId, ref: "JarLocation"}],
  last_updated: {type: Date, default: Date.now },
  countOfRecommendtaions: {type: Number, default: 0},
  countOfWishlists: {type: Number, defualt: 0}
},{

  timestamps: true

});

jarSchema.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("Jar", jarSchema);