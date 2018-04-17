'use strict';
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var utility = require('utility');

module.exports.handler = (event, context, callback) => {
  var tableName = process.env.REQUESTS_TABLE;

  switch (event.httpMethod) {
    case "PUT":
      saveRequestApproval();
      break;

    default:
      utility.sendResponse(501, {
        "Error": "Unsupported HTTP method(" + event.httpMethod + ")"
      }, callback);
  }

  function saveRequestApproval() {
    var body = JSON.parse(event.body);
    var id = body.id;
    var approval = body.approval;

    docClient.update({
        "TableName": tableName,
        "Key": {
          "id": id
        },
        UpdateExpression: "set approval = :a",
        ExpressionAttributeValues: {
          ":a": approval
        },
        ReturnValues: "UPDATED_NEW"
      },
      function (err, data) {
        utility.sendResponse(err, data, callback);
      });
  }
};