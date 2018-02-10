'use strict';
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var uuidv1 = require('uuid/v1');

exports.handler = (event, context, callback) => {
  var projectUpdatesTableName = process.env.PROJECT_UPDATES_TABLE_NAME;
  let id = (event.pathParameters !== null ? event.pathParameters.project : false);

  switch (event.httpMethod) {
    case "GET":
      if (id) {
        getProject(id);
      } else {
        getProjects();
      }
      break;

    case "POST":
      saveProject(id);
      break;

    case "PUT":
      saveProject(id);
      break;

    case "DELETE":
      deleteProject(id)
      break;

    default:
      // Send HTTP 501: Not Implemented
      console.log("Error: unsupported HTTP method (" + event.httpMethod + ")");
      callback(null, { statusCode: 501 })
  }

  function saveProject(id) {
    var item = {};
    var datetime = new Date().getTime().toString();
    var params = JSON.parse(event.body);

    if (id) {
      item.id = id;
    } else {
      item.id = uuidv1();
    }

    item.updated = datetime;
    params.department != null ? item.department = params.department : null;
    params.name != null ? item.name = params.name : null;
    params.description != null ? item.description = params.description : null;
    params.owner != null ? item.owner = params.owner : null;
    params.lead != null ? item.lead = params.lead : null;
    params.hasProjectPlan != null ? item.hasProjectPlan = params.hasProjectPlan : null;
    params.hasWiki != null ? item.hasWiki = params.hasWiki : null;
    params.hasJiraProject != null ? item.hasJiraProject = params.hasJiraProject : null;
    params.hasCodeRepository != null ? item.hasCodeRepository = params.hasCodeRepository : null;
    params.projectPlanLink != null ? item.projectPlanLink = params.projectPlanLink : null;
    params.wikiLink != null ? item.wikiLink = params.wikiLink : null;
    params.jiraLink != null ? item.jiraLink = params.jiraLink : null;
    params.codeRepositoryLink != null ? item.codeRepositoryLink = params.codeRepositoryLink : null;
    params.executionStatus != null ? item.executionStatus = params.executionStatus : null;

    docClient.put({
      "TableName": projectsTableName,
      "Item": item
    }, function (err, data) {
      if (err) {
        sendResponse(400, err);
      } else {
        sendResponse(200, data);
      }
    });
  }

  function deleteProject(id) {
    dynamodb.deleteItem({
      TableName: projectsTableName,
      Key: {
        "id": {
          "S": id
        }
      }
    },
      function (err, data) {
        if (err) {
          sendResponse(400, err);
        } else {
          sendResponse(200, data);
        }
      });
  }

  function getProject(id) {
    docClient.get({
      TableName: projectsTableName,
      Key: {
        "id": id
      }
    },
      function (err, data) {
        if (err) {
          sendResponse(400, err);
        } else {
          sendResponse(200, data);
        }
      });
  }

  function getProjects() {
    var params = { TableName: projectsTableName };

    if (event['pathParameters'] && event['pathParameters']['department']) {
      params.FilterExpression = '#department = :d',
        params.ExpressionAttributeValues = { ':d': event['pathParameters']['department'] },
        params.ExpressionAttributeNames = { "#department": "department" }
    }

    docClient.scan(
      params,
      function (err, data) {
        if (err) {
          sendResponse(400, err);
        } else {
          sendResponse(200, data);
        }
      });
  }

  function sendResponse(statusCode, data) {
    callback(null, {
      "isBase64Encoded": false,
      "statusCode": statusCode,
      "headers": {
        "Access-Control-Allow-Origin": "*"
      },
      "body": JSON.stringify(data)
    });
  }
}