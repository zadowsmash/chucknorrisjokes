const AWS = require('aws-sdk');

const ses = new AWS.SES();
const docClient = new AWS.DynamoDB.DocumentClient();
const { TableName, emailaddress } = process.env;

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
        const sesparams = {
          Destination: {
            BccAddresses: itemdataEmailArray,
        
          },
          Message: {
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: ` 
                <html>
                <body>   
                <font size="+3"> <b> Update from chuck-norris-random-daily-jokes.net <b> </font>
                <br>
                <font size="+1"> Apolagies to all my subscribers for the late joke email today. Some clown decided to put \n
                a bunch of fake invalid email addresses into the site and wrote them to the database, this caused the back end code to break \n
                and not send the daily email at 12pm. \n
                I have cleaned it up and added extra functionality to the front end website and the back end code to prevent this \n
                from happening again.
                Appreciate your understanding.
                Cheers</font>
                <br>
                <img src='https://s3-ap-southeast-2.amazonaws.com/chuck-norris-jokes/img/chuck_approved.jpg'/>
                <br>
                <font size="+3"> <b> Keep on Chuckin! <b> </font>
                <br>
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



