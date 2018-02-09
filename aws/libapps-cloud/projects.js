'use strict';

exports.handler = (event, context, callback) => {

  let id = (event.pathParameters !== null ? event.pathParameters.project : false);

  switch (event.httpMethod) {

    case "GET":

      if (id) {
        callback(null, { body: "This is a READ operation on project ID " + id });
        return;
      }

      callback(null, { body: "This is a LIST operation, return all projects" });
      break;

    case "POST":
      callback(null, { body: "This is a CREATE operation" });
      break;

    case "PUT":
      callback(null, { body: "This is an UPDATE operation on project ID " + id });
      break;

    case "DELETE":
      callback(null, { body: "This is a DELETE operation on project ID " + id });
      break;

    default:
      // Send HTTP 501: Not Implemented
      console.log("Error: unsupported HTTP method (" + event.httpMethod + ")");
      callback(null, { statusCode: 501 })

  }
}