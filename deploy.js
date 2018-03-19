
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-west-2'});

s3 = new AWS.S3({apiVersion: '2006-03-01'});

s3.listBuckets((err, data) => {
  console.log(err,data);
}) 
