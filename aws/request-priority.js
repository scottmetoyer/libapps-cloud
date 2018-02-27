'use strict';
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var utility = require('utility');

module.exports.handler = (event, context, callback) => {
  var tableName = process.env.REQUESTS_TABLE;

  switch (event.httpMethod) {
    case "PUT":
      saveRequestPriorities();
      break;

    default:
      utility.sendResponse(501, { "Error": "Unsupported HTTP method(" + event.httpMethod + ")" }, callback);
  }

  function saveRequestPriorities() {
    var requests = JSON.parse(event.body);

    for(var i = 0; i < requests.length; i++) {
      var request = requests[i];

      docClient.update({
        "TableName": tableName,
        "Key": {
          "id": request.id
        },
        UpdateExpression: "set priority = :p",
        ExpressionAttributeValues: {
          ":p": i
        },
        ReturnValues: "UPDATED_NEW"
      },
        function (err, data) {
          utility.sendResponse(err, data, callback);
        });
    }
  }
};