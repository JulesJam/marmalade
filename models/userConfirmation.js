var mongoose = require('mongoose');

var userConfirmationSchema = mongoose.Schema({
  userId: { type: String},
  userEmailAddress: { type: String },
  emailSentDate: {type: Date, default: Date.now },
  reminderSentDate: [{ type: Date }],
  acceptedDate: { type: Date},
  rejectDate: { type: Date},
  status: {type: String, default: 'Pending'},
},{
  timestamps: true
});

userConfirmationSchema.set('toJSON', { getters: true, virtuals: false});

module.exports = mongoose.model("userConfirmation", userConfirmationSchema);