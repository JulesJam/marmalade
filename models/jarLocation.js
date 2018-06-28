var mongoose = require('mongoose');

var jarLocationSchema = mongoose.Schema({
  creatorId: { type: mongoose.Schema.ObjectId, ref: "User", /*required: true */},
  location: { type: mongoose.Schema.ObjectId, ref: "Location" /*required: true*/},
  userIds: [{type: mongoose.Schema.ObjectId, ref: "User"}],
  jarId: {type: mongoose.Schema.ObjectId, ref: "Jar"},
  branchCode: [{type: Number}],
  descriptions: [{ type: String}],//this is the jar description all users see added by initial creator
  jarLocationType: {type: String},//Restaurant coffee Shop etc
  tags: [{ type: String}],//can be added to by all users
  votes:{type: Number, default: 1},// this is votes at jar level
  views:[{type: Date, default: []}],
  searchType: {type: String},
  verifiedDate:{type: Date},
  verifiedByUserId: { type: mongoose.Schema.ObjectId, ref: "User"},
  source: {type: String},
  upVotedBy:[{type: mongoose.Schema.ObjectId, ref: "User"}],
  downVotedBy:[{type: mongoose.Schema.ObjectId, ref: "User"}],
  hidden:{type: Boolean, default: false}//hides at jar level
},{
  timestamps: true
});

jarLocationSchema.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("JarLocation", jarLocationSchema);