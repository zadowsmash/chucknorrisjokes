const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();


const { TableName, HashKey } = process.env;

exports.handler = (event) => {

  var params = {
    RequestItems: {
      'emailSubs': [
        {
          DeleteRequest: {
            Key: { email: 'email@toremove.com' }
          }
        }
      ]
    }
  };
  
  documentClient.batchWrite(params, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
  });


};