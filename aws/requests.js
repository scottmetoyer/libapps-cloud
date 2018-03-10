'use strict';
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var uuidv1 = require('uuid/v1');
var utility = require('utility');

module.exports.handler = (event, context, callback) => {
  var tableName = process.env.REQUESTS_TABLE;
  let id = (event.pathParameters !== null ? event.pathParameters.request : false);

  switch (event.httpMethod) {
    case "GET":
      if (id) {
        getRequest(id);
      } else {
        getRequests();
      }
      break;

    case "POST":
    case "PUT":
      saveRequest(id);
      break;

    case "DELETE":
      deleteRequest(id);
      break;

    default:
      utility.sendResponse(501, { "Error": "Unsupported HTTP method(" + event.httpMethod + ")" }, callback);
  }

  function saveRequest(id) {
    var item = {};
    var datetime = new Date().getTime().toString();
    var params = JSON.parse(event.body);

    id ? item.id = id : item.id = uuidv1();
    item.timestamp = datetime;

    params.createdBy != null ? item.createdBy = params.createdBy : null;
    params.type != null ? item.type = params.type : null;
    params.description != null ? item.description = params.description : null;
    params.quantity != null ? item.quantity = params.quantity : null;
    params.cost != null ? item.cost = params.cost : null;
    params.vendor != null ? item.vendor = params.vendor : null;
    params.link != null ? item.link = params.link : null;
    params.justification != null ? item.justification = params.justification : null;
    params.department != null ? item.department = params.department : null;
    params.location != null ? item.location = params.location : null;
    params.requester_priority != null ? item.requester_priority = params.requester_priority : null;
    params.aul_priority != null ? item.aul_priority = params.aul_priority : null;

    docClient.put({
      "TableName": tableName,
      "Item": item
    },
      function (err, data) {
        utility.sendResponse(err, data, callback);
      });
  }

  function deleteRequest(id) {
    docClient.deleteItem({
      TableName: tableName,
      Key: {
        "id": {
          "S": id
        }
      }
    },
      function (err, data) {
        utility.sendResponse(err, data, callback);
      });
  }

  function getRequest(id) {
    docClient.get({
      TableName: tableName,
      Key: {
        "id": id
      }
    },
      function (err, data) {
        utility.sendResponse(err, data, callback);
      });
  }

  function getRequests() {
    var params = { TableName: tableName };

    if (event['pathParameters'] && event['pathParameters']['type']) {
      params.FilterExpression = '#type = :t',
        params.ExpressionAttributeValues = { ':t': event['pathParameters']['type'] },
        params.ExpressionAttributeNames = { "#type": "type" }
    }

    docClient.scan(
      params,
      function (err, data) {
        utility.sendResponse(err, data, callback);
      });
  }
};