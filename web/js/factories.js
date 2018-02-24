(function () {

  angular.module('pixeladmin')
    .factory('data', ['$http', function ($http) {
      var urlBase = 'https://j1wzq8z8w5.execute-api.us-west-1.amazonaws.com/dev';
      var dataFactory = {};

      dataFactory.getProjects = function (id) {
        if (id) {
          return $http.get(urlBase + '/project/' + id);
        } else {
          return $http.get(urlBase + '/projects');
        }
      }

      dataFactory.saveProject = function (project) {
        if (project.id) {
          return $http.put(urlBase + "/project/" + project.id, JSON.stringify(project));
        } else {
          return $http.post(urlBase + "/projects", JSON.stringify(project));
        }
      }

      dataFactory.getStatusUpdates = function (projectId) {
        return $http.get(urlBase + "/project/" + projectId + "/project-updates");
      }

      dataFactory.saveStatusUpdate = function (status) {
        return $http.post(urlBase + "/project/" + status.projectId + "/project-updates", JSON.stringify(status))
      }

      dataFactory.getRecurringTasks = function () {
        return $http.get(urlBase + "/tasks")
      }

      dataFactory.getRecurringTaskInstances = function (year) {
        return $http.get(urlBase + "/tasks/instances/" + year);
      }

      dataFactory.saveRequest = function (request) {
        if (request.id != null) {
          return $http.put(urlBase + "/request/" + request.id, JSON.stringify(request));
        } else {
          return $http.post(urlBase + "/requests", JSON.stringify(request));
        }
      }

      dataFactory.getRequests = function (id) {
        if (id) {
          return $http.get(urlBase + '/request/' + id);
        } else {
          return $http.get(urlBase + '/requests');
        }
      }

      return dataFactory;
    }])
})();