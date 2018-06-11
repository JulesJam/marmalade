var mongoose = require('mongoose');

var invitationSchema = mongoose.Schema({
  senderId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  jarId: { type: mongoose.Schema.ObjectId, ref: "Jar", required: true },
  recipientEmailAddress: { type: String, required: true, require: true},
  senderMembershipLevel: { type: Number},
  branchCode: { type: String, /*required: true,*/ default: ''},
  emailSentDate: {type: Date, default: Date.now },
  reminderSentDate: [{ type: Date }],
  acceptedDate: { type: Date},
  rejectDate: { type: Date},
  status: {type: String, default: 'Pending'},
  last_updated: {type: Date, default: Date.now }
},{

  timestamps: true

});

invitationSchema.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("invitation", invitationSchema);