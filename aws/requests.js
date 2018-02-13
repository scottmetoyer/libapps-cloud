'use strict';
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var uuidv1 = require('uuid/v1');
var utility = require('utility');

module.exports.handler = (event, context, callback) => {
  var projectsTableName = process.env.PROJECTS_TABLE;
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
    case "PUT":
      saveProject(id);
      break;

    case "DELETE":
      deleteProject(id);
      break;

    default:
      utility.sendResponse(501, { "Error": "Unsupported HTTP method(" + event.httpMethod + ")" }, callback);
  }

  function saveProject(id) {
    var item = {};
    var datetime = new Date().getTime().toString();
    var params = JSON.parse(event.body);

    id ? item.id = id : item.id = uuidv1();
    item.timestamp = datetime;
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
    },
      function (err, data) {
        utility.sendResponse(err, data, callback);
      });
  }

  function deleteProject(id) {
    docClient.deleteItem({
      TableName: projectsTableName,
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

  function getProject(id) {
    docClient.get({
      TableName: projectsTableName,
      Key: {
        "id": id
      }
    },
      function (err, data) {
        utility.sendResponse(err, data, callback);
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
        utility.sendResponse(err, data, callback);
      });
  }
};