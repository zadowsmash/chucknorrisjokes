const AWS = require('aws-sdk');

const {
  TableName,
  emailaddress,
} = process.env;

const dynamodb = new AWS.DynamoDB();

exports.handler = (event) => {
  console.log(event); // eslint-disable-line
  
  const params = {
    TableName,
    Item: {
      USERID: { S: USERIDSTRING },
      email: { S: emailaddress }
    },
  };
  
  dynamodb.deleteItem(params, (err, data) => {
    if (err) console.log(err, err.stack); // eslint-disable-line
    else console.log(data); // eslint-disable-line
  });
};
