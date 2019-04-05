const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();
const { TableName } = process.env;

exports.handler = (event, context, callback) => {
  console.log(event); // eslint-disable-line
  const { emailDelete } = JSON.parse(event.body);

  const dcqparams = {
    TableName,
    IndexName: 'email-index',

    KeyConditionExpression: 'email = :hkey ',
    ExpressionAttributeValues: {
      ':hkey': emailDelete,
    }
  };

  docClient.query(dcqparams, (dcqerr, dcqdata) => {
    if (dcqerr) {
      console.error("Unable to read item. Error JSON:", JSON.stringify(dcqerr, null, 2)); // eslint-disable-line
    } else {
      console.log("GetItem succeeded:", JSON.stringify(dcqdata, null, 2)); // eslint-disable-line
      const finalEmailDelete = dcqdata.Items[0].email;
      const finalUserId = dcqdata.Items[0].USERID;
      const dcdparams = {
        TableName,
        Key: {

          USERID: finalUserId,
          email: finalEmailDelete
        }
      };

      docClient.delete(dcdparams, (dcdderr, dcddata) => {
        console.log(dcddata) // eslint-disable-line
        if (dcdderr) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(dcdderr, null, 2)); // eslint-disable-line
        } else {
          callback(null, {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': 'https://chuck-norris-random-daily-jokes.net'
            }
          });
        }
      });
    }
  });
};
