'use strict';
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var utility = require('utility');

module.exports.handler = (event, context, callback) => {
  var tableName = process.env.REQUESTS_TABLE;

  switch (event.httpMethod) {
    case "PUT":
      saveRequestStatus();
      break;

    default:
      utility.sendResponse(501, { "Error": "Unsupported HTTP method(" + event.httpMethod + ")" }, callback);
  }

  function saveRequestStatus() {
    var request = JSON.parse(event.body);

    docClient.update({
      "TableName": tableName,
      "Key": {
        "id": request.id
      },
      UpdateExpression: "set #request_status = :s",
      ExpressionAttributeValues: {
        ":s": request.status
      },
      ExpressionAttributeNames: {
        "#request_status" : "status"
      },
      ReturnValues: "UPDATED_NEW"
    },
      function (err, data) {
        utility.sendResponse(err, data, callback);
      });
  }
};