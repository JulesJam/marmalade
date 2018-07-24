var Mailgun = require("mailgun-js");
var api_key = process.env.MAILGUN_SECERET_KEY;
var DOMAIN = 'mg.midnightmarmala.de';
var mailgun = new Mailgun({apiKey: api_key, domain: DOMAIN});





function sendMessage(recipient, copyTo, subject, message){
  console.log("CopyTo is ", copyTo);
  if(copyTo){
  var data = {
    from: 'Midnightmarmalade <jules@mg.midnightmarmala.de>',
    to: recipient,
    cc: copyTo,
    subject: subject,
    text: message
  };
  } else if (!copyTo){
    var data = {
      from: 'Midnightmarmalade <jules@mg.midnightmarmala.de>',
      to: recipient,
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