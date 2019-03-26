const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();
const {
  TableName,
  emailDelete,
} = process.env;

exports.handler = (event) => {
  console.log(event); // eslint-disable-line

  var params = {
    TableName: TableName,
    IndexName: 'email-index',

    KeyConditionExpression: 'email = :hkey ',
    ExpressionAttributeValues: {
      ':hkey': emailDelete,
    }
  };

  docClient.query(params, function (err, data) {
    if (err) {
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2)); // eslint-disable-line
    } else {
      console.log("GetItem succeeded:", JSON.stringify(data, null, 2)); // eslint-disable-line
    }
  });

}