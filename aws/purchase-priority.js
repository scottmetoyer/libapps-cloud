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
    var body = JSON.parse(event.body);
    var requests = body.requests;
    var type = body.type;

    if (!type) {
      type == "requester";
    }

    for(var i = 0; i < requests.length; i++) {
      var request = requests[i];

      docClient.update({
        "TableName": tableName,
        "Key": {
          "id": request.id
        },
        UpdateExpression: "set " + type + "Priority = :p",
        ExpressionAttributeValues: {
          ":p": i + 1
        },
        ReturnValues: "UPDATED_NEW"
      },
        function (err, data) {
          utility.sendResponse(err, data, callback);
        });
    }
  }
};