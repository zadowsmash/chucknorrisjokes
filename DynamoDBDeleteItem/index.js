const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();
const { TableName, hashKey } = process.env;

exports.handler = (event) => {

    var params = {
        TableName : TableName,
        Key: {
          HashKey: HashKey,
          NumberRangeKey: 1
        },
        ConditionExpression: 'email@toremove.com',
      };
      
      docClient.delete(params, function(err, data) {
        if (err) console.log(err);
        else console.log(data);
      });


};