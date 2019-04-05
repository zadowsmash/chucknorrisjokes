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
          
          <font size="+3"> <b> We Are Truly Sorry to See You Go!<b> </font>
          <br>
          <br>
          <img src='https://s3-ap-southeast-2.amazonaws.com/chuck-norris-jokes/img/chuck_cry.jpg'/>
          <br>
          <font size="+3"> Today, You Have Made Chuck Cry! </font>
          <br>
          <br>
          <font size="+1"> If You Ever Want to Subscribe Again, Please Click </font>
          <a href="chuck-norris-random-daily-jokes.net" <font size="1"> Here</a>
          <br>
          <font size="+1">Enter Your Email Address in the Subscribe field and click.</font>
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
