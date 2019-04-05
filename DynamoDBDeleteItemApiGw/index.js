const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();
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
  const sesparams = {
    Destination: {
      ToAddresses: [emailDelete],

    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: ` 
          <html>
          <body> 
          
          <font size="+2"> <b> We are truly sorry to see you go!<b> </font>
          <br>
          <br>
          <img src='http://cdn3-www.musicfeeds.com.au/assets/uploads/chuck-norris-onions.jpg'/>
          <br>
          <font> Today, you have made Chuck cry </font>
          
          <font> If you ever want to Subscribe again, please Click </font>
          <a href="chuck-norris-random-daily-jokes.net">here</a> <font>, Enter your email address in the SUBSCRIBE field and click.</font>
          </body> 
          </html>`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: '',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Daily Random Chuck Norris Jokes',
      },
    },
    Source: 'ChuckNorrisJokes@chuck-norris-random-daily-jokes.net',
  };
  ses.sendEmail(sesparams, (seserr, sesdata) => {
    if (seserr) console.log(seserr, seserr.stack); // eslint-disable-line
    else console.log(sesdata); // eslint-disable-line
  });
};
