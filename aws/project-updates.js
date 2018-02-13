'use strict';
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var uuidv1 = require('uuid/v1');
var utility = require('utility');

module.exports.handler = (event, context, callback) => {
  var projectUpdatesTableName = process.env.PROJECT_UPDATES_TABLE;
  let project = event.pathParameters.project;

  switch (event.httpMethod) {
    case "GET":
      getProjectUpdates(project);
      break;

    case "POST":
      saveProjectUpdate(project);
      break;

    default:
      utility.sendResponse({ "Error": "Unsupported HTTP method(" + event.httpMethod + ")" }, null, callback);
  }

  function getProjectUpdates(project) {
    var params = {
      TableName: projectUpdatesTableName,
      FilterExpression: '#projectId = :p',
      ExpressionAttributeValues: { ':p': project },
      ExpressionAttributeNames: { "#projectId": "projectId" }
    };

    docClient.scan(
      params,
      function (err, data) {
        utility.sendResponse(err, data, callback);
      });
  }

  function saveProjectUpdate(project) {
    var datetime = new Date().getTime().toString();
    var item = {};
    var params = JSON.parse(event.body);

    item.id = uuidv1();
    item.projectId = project;
    item.timestamp = datetime;
    item.text = params.text;
    item.user = params.user;

    docClient.put({
      "TableName": projectUpdatesTableName,
      "Item": item
    }, function (err, data) {
      utility.sendResponse(err, data, callback);
    });
  }
};