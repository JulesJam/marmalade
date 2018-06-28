var mongoose = require('mongoose');


var userCommentSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  userLocationId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  comment: {type: String}
},{

  timestamps: true

});

userCommentSchema.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("UserComment", jarSchema);