const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();
const { TableName, hashKey } = process.env;