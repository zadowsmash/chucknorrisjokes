const AWS = require('aws-sdk');

const {
  TableName,

} = process.env;


const dynamodb = new AWS.DynamoDB();
const ses = new AWS.SES();
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
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': 'https://chuck-norris-random-daily-jokes.net'
        }
      });
    }
  });
  const sesparams = {
    Destination: {
      ToAddresses: [emailaddress],

    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: ` 
          <html>
          <body> 
          
          <font size="+2"> <b> Congratulations for signing up to chuck-norris-random-daily-jokes.net  <b> </font>
          <br>
          <br>
          <img src='https://images-na.ssl-images-amazon.com/images/I/61rt%2Bdzyi9L._SX425_.jpg'/>
          <br>
          
          
          <font> If you ever want to UN-Subscribe, please Click </font>
          <a href="chuck-norris-random-daily-jokes.net">here</a> <font>, Enter your email address in the UN-SUBSCRIBE field and click.</font>
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
