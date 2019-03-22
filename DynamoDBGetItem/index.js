const AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

const {
  emailaddress,
  TableName, hashKey, rangeKey
} = process.env;
//const result = AWS.DynamoDB.Converter.unmarshall()
exports.handler = (event) => {
  var params = {
    ProjectionExpression : emailaddress,
    Key: {
      hashKey : {
        N: hashKey
      },
      rangeKey: {
        S: rangeKey
      },
    },
    TableName: TableName
  };
  dynamodb.getItem(params, function (err, data) {
    if (err) console.log(err, err.stack); 
    else console.log(data.Table.ItemCount);

  });


}