const AWS = require('aws-sdk');

const {
  TableName,

} = process.env;


const dynamodb = new AWS.DynamoDB();
const userId = Math.floor(new Date() / 1000);
const userIdString = userId.toString();

exports.handler = (event, contaxt, callback) => {
  console.log(event); // eslint-disable-line
  const { emailaddress } = JSON.parse(event.body);

  const params = {
    TableName,
    Item: {
      USERID: { S: userIdString },
      email: { S: emailaddress },
    },
  };

  dynamodb.putItem(params, (err, data) => {
      console.log(data) // eslint-disable-line
    if (err) console.log(err, err.stack); // eslint-disable-line
    else {
      callback(null, {
        statusCode: 200
      });
    }
  });
};
