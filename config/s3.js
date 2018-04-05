var aws = require('aws-sdk');

module.exports = new aws.S3({
  secretAccessKey: process.env.MARMALADE_AWS_SECRET_KEY,
  accessKeyId: process.env.MARMALADE_AWS_ACCESS_KEY,
  region: 'eu-west-2'
});