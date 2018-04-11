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

    params.createdBy ? item.createdBy = params.createdBy : null;
    params.type ? item.type = params.type : null;
    params.description ? item.description = params.description : null;
    params.quantity ? item.quantity = params.quantity : null;
    params.cost ? item.cost = params.cost : null;
    params.vendor ? item.vendor = params.vendor : null;
    params.link ? item.link = params.link : null;
    params.justification ? item.justification = params.justification : null;
    params.department ? item.department = params.department : null;
    params.location ? item.location = params.location : null;
    params.requesterPriority ? item.requesterPriority = params.requesterPriority : null;
    params.aulPriority ? item.aulPriority = params.aulPriority : null;
    params.jiraCase ? item.jiraCase = params.jiraCase : null;
    params.tags ? item.tags = params.tags : null;
    params.status ? item.status = params.status : null;
    params.comments ? item.comments = params.comments : null;
    params.approved ? item.approved = params.approved : null;

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

    if (event['queryStringParameters'] && event['queryStringParameters']['type']) {
      params.FilterExpression = '#type = :t',
      params.ExpressionAttributeValues = { ':t': event['queryStringParameters']['type'] },
      params.ExpressionAttributeNames = { "#type": "type" }
    }

    docClient.scan(
      params,
      function (err, data) {
        utility.sendResponse(err, data, callback);
      });
  }
};