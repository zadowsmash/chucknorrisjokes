const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();
const {
  TableName,
  emailDelete,
} = process.env;

exports.handler = (event) => {
  console.log(event); // eslint-disable-line

  const dcqparams = {
    TableName: TableName,
    IndexName: 'email-index',

    KeyConditionExpression: 'email = :hkey',
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
      console.log(finalEmailDelete);
      console.log(finalUserId);

      const dcdparams = {
        TableName: TableName,
        Key: {

          USERID: finalUserId,
          email: finalEmailDelete
        }
      };

      docClient.delete(dcdparams, (dcdderr, data) => {
        if (dcdderr) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(dcdderr, null, 2)); // eslint-disable-line
        } else {
          console.log("GetItem succeeded:", JSON.stringify(data, null, 2)); // eslint-disable-line
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
