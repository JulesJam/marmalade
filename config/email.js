var Mailgun = require("mailgun-js");
var api_key = process.env.MAILGUN_SECERET_KEY;
var DOMAIN = 'mg.midnightmarmala.de';
var mailgun = new Mailgun({apiKey: api_key, domain: DOMAIN});

var data = {
  from: 'Excited User <julian@mg.midnightmarmala.de>',
  to: 'julian.wyatt@me.com, julian@mg.midnightmarmala.de',
  subject: 'Invitation to MidnightMarmalade',
  text: 'Midnightmarmalade invites you!'
};




function sendMessage(recipient, copyTo, subject, message){
  console.log("CopyTo is ", copyTo);
  if(copyTo){
  var data = {
    from: 'Midnightmarmalade <julian@mg.midnightmarmala.de>',
    to: 'julian.wyatt@me.com',
    cc: copyTo,
    subject: subject,
    text: message
  };
  } else if (!copyTo){
    var data = {
      from: 'Midnightmarmalade <julian@mg.midnightmarmala.de>',
      to: 'julian.wyatt@me.com',
      subject: subject,
      text: message
    };
  }
mailgun.messages().send(data, function (error, body) {
  console.log(body);
});

}

module.exports = {
  send: sendMessage
}