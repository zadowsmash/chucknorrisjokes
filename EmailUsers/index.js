const AWS = require('aws-sdk');

const ses = new AWS.SES();

const https = require('https');
const gis = require('g-i-s');

const docClient = new AWS.DynamoDB.DocumentClient();
const { TableName } = process.env;
const url = 'https://api.icndb.com/jokes/random/';

const onScan = params => new Promise((resolve, reject) => {
  const localParam = params; // eric
  docClient.scan(params, (err, data) => {
    if (err) {
        console.error(JSON.stringify(err, null, 2)); // eslint-disable-line
    } else {
      const itemdataEmailArray = [];
      data.Items.forEach((itemdata) => {
        itemdataEmailArray.push(itemdata.email);
      });

        console.log(itemdataEmailArray); // eslint-disable-line
      const opts = {
        searchTerm: ['Chuck Norris Movie', 'Chuck Norris Jeans 70s', 'Chuck Norris action'],
        queryStringAddition: '&tbs=ic:trans',
        filterOutDomains: [
          'pinterest.com',
          'deviantart.com',
          'giphy.com',
          'images-na.ssl-images-amazon.com',
          'i.dlpng.com',
          'www.scoopnest.com',
          'whowouldwinafight.com',
          'brainstaple.com',
          '66.media.tumblr.com',
          'jeremysaid.com',
          'cdn.shopify.com',
          'png2.kisspng.com',
          'pbs.twimg.com',
          'static1.squarespace.com',
          'www.millcreekent.com',
          'www.stutzfamily.com',
          'cdn130.picsart.com',
          '4q.cc',
          'ultimateactionmovies.com',
          'i386.photobucket.com',
          'cdn140.picsart.com'
        ],
      };

      gis(opts, (resulterror, results) => {
        if (resulterror) {
            console.log(resulterror); // eslint-disable-line
        } else {
          const arrayRandom = Math.floor(Math.random() * results.length);
          const randomImage = results[arrayRandom].url;
            console.log(randomImage); // eslint-disable-line
          https.get(url, (res) => {
            res.on('data', (joke) => {
              const parsejoke = JSON.parse(joke);
              const sesparams = {
                Destination: {
                  ToAddresses: itemdataEmailArray,

                },
                Message: {
                  Body: {
                    Html: {
                      Charset: 'UTF-8',
                      Data: ` 
   <html>
   <body> 
   
   <font size="+2"> <b> ${parsejoke.value.joke} <b> </font>
   <br>
   <br>
   <br>
   <img src=${randomImage} />
   </body> 
   </html>`,
                    },
                    Text: {
                      Charset: 'UTF-8',
                      Data: parsejoke.value.joke,
                    },
                  },
                  Subject: {
                    Charset: 'UTF-8',
                    Data: 'Daily Random Chuck Norris Jokes',
                  },
                },
                Source: 'Chuck_Norris_Jokes@hcs.datacom.com.au',
              };
                console.log(parsejoke.value.joke); // eslint-disable-line
              ses.sendEmail(sesparams, (seserr, sesdata) => {
                  if (err) console.log(seserr, seserr.stack); // eslint-disable-line
                  else console.log(sesdata); // eslint-disable-line
              });
            });
          }).on('error', (error) => {
              console.error(error); // eslint-disable-line
            reject(error);
          });
        }
      });

      // resolve(data.LastEvaluatedKey);
      if (typeof data.LastEvaluatedKey !== 'undefined') {
          console.log('Scanning for more...'); // eslint-disable-line
        localParam.ExclusiveStartKey = data.LastEvaluatedKey;
        onScan(localParam);
      }
    }
  });
});

exports.handler = (event) => {
    console.log(event); // eslint-disable-line

  const params = {
    TableName,
    ProjectionExpression: '#email, USERID',
    ExpressionAttributeNames: {
      '#email': 'email',
    },
  };

  onScan(params);
};
