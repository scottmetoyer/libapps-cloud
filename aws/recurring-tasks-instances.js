'use strict';
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var uuidv1 = require('uuid/v1');
var utility = require('utility');

module.exports.handler = (event, context, callback) => {
  var tableName = process.env.TASKS_TABLE;
  let id = (event.pathParameters !== null ? event.pathParameters.task : false);

  switch (event.httpMethod) {
    case "GET":
      if (id) {
        getItem(id);
      } else {
        getItems();
      }
      break;

    case "POST":
    case "PUT":
      saveItem(id);
      break;

    case "DELETE":
      deleteItem(id);
      break;

    default:
      utility.sendResponse(501, { "Error": "Unsupported HTTP method(" + event.httpMethod + ")" }, callback);
  }

  function saveItem(id) {
    var item = {};
    var datetime = new Date().getTime().toString();
    var params = JSON.parse(event.body);

    id ? item.id = id : item.id = uuidv1();
    item.timestamp = datetime;
    params.name != null ? item.name = params.name : null;
    params.description != null ? item.description = params.description : null;
    params.owner != null ? item.owner = params.owner : null;
    params.schedule != null ? item.schedule = params.schedule : null;
  
    docClient.put({
      "TableName": tableName,
      "Item": item
    },
      function (err, data) {
        utility.sendResponse(err, data, callback);
      });
  }

  function deleteItem(id) {
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

  function getItem(id) {
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

  function getItems() {
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