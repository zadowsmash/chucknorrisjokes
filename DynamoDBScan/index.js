const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();
const { TableName } = process.env; //test

exports.handler = (event) => {
  console.log(event); // eslint-disable-line
  const params = {
    TableName,
    ProjectionExpression: '#email, USERID',
    ExpressionAttributeNames: {
      '#email': 'email',
    },
  };

  docClient.scan(params, onScan);
  function onScan(err, data) {
    if (err) {
      console.error(JSON.stringify(err, null, 2)); // eslint-disable-line
    } else {
      const itemdataEmailArray = [];
      data.Items.forEach((itemdata) => {
        itemdataEmailArray.push(itemdata.email);
      });
      console.log(itemdataEmailArray); // eslint-disable-line

      if (typeof data.LastEvaluatedKey !== 'undefined') {
        console.log('Scanning for more...'); // eslint-disable-line
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        docClient.scan(params, onScan);
      }
    }
  }
};
