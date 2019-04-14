const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

const { TableName } = process.env;

exports.handler = (event) => {
  console.log(event); // eslint-disable-line

  var params = {
    TableName: TableName
  };
  dynamodb.describeTable(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(JSON.stringify(data, null, 2));
  });

};