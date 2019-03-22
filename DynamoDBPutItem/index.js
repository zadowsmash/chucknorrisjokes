const AWS = require('aws-sdk');

const {
  TableName,
  emailaddress,
} = process.env;

const dynamodb = new AWS.DynamoDB();
const USERID = Math.floor(new Date() / 1000);
const USERIDSTRING = USERID.toString();

exports.handler = (event) => {
  console.log(event); // eslint-disable-line
  
  const params = {
    TableName,
    Item: {
      USERID: { S: USERIDSTRING },
      email: { S: emailaddress },
    },
  };
  
  dynamodb.putItem(params, (err, data) => {
    if (err) console.log(err, err.stack); // eslint-disable-line
    else console.log(data); // eslint-disable-line
  });
};
