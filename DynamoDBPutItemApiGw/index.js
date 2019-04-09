const AWS = require('aws-sdk');

const {
  TableName,
} = process.env;

const dynamodb = new AWS.DynamoDB();
const ses = new AWS.SES();
const crypto = require('crypto');
const validator = require('email-validator');

exports.handler = (event, contaxt, callback) => {
  console.log(event); // eslint-disable-line
  const { emailaddress } = JSON.parse(event.body);

  const params = {
    TableName,
    Item: {
      USERID: { S: crypto.randomBytes(16).toString('hex') },
      email: { S: emailaddress },
    },
  };

  if (validator.validate(emailaddress) === true) {
    dynamodb.putItem(params, (err, data) => {
      if (err) console.log(err, err.stack); // eslint-disable-line
      else console.log(data); // eslint-disable-line
    });
  } else {
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://chuck-norris-random-daily-jokes.net'
      }
    });
  }


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
          <font size="+3"> <b> Congratulations For Signing Up to chuck-norris-random-daily-jokes.net <b> </font>
          <br>
          <br>
          <img src='https://s3-ap-southeast-2.amazonaws.com/chuck-norris-jokes/img/chuck_approved.jpg'/>
          <br>
          <font size="+1"> If You Ever Want to Un-Subscribe, Please Click </font>
          <a href="chuck-norris-random-daily-jokes.net">Here</a> 
          <br>
          <font size="+1">Enter Your Email Address in the Un-Subscribe Field and Click.</font>
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
  if (validator.validate(emailaddress) === true) {
    ses.sendEmail(sesparams, (seserr, sesdata) => {
      if (seserr) console.log(seserr, seserr.stack); // eslint-disable-line
      else console.log(sesdata); // eslint-disable-line
    });
  } else {
    console.log('invalid email'); // eslint-disable-line
  }
};
