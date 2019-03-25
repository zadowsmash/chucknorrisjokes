const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();


const { TableName, HashKey } = process.env;

exports.handler = (event) => {

  var params = {
    RequestItems: {
      'emailSubs': [
        {
          DeleteRequest: {
            Key: { USERID: 'email@toremove.com' }
          }
        }
      ]
    }
  };
  
  docClient.batchWrite(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
  



};