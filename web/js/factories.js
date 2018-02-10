(function () {

  angular.module('pixeladmin')
    .factory('data', ['$http', function ($http) {
      var urlBase = 'https://bncxtg1x83.execute-api.us-west-1.amazonaws.com/Stage';
      var dataFactory = {};

      dataFactory.getProjects = function (id) {
        if (id) {
          return $http.get(urlBase + '/project/' + id);
        } else {
          return $http.get(urlBase + '/projects');
        }
      }

      dataFactory.saveProject = function (project) {
        return $http.post(urlBase + "/projects", JSON.stringify(project));
      }

      dataFactory.getStatusUpdates = function (projectId) {
        return $http.get(urlBase + "/project/" + projectId + "/project-updates");
      }

      dataFactory.saveStatusUpdate = function (status) {
        return $http.post(urlBase + "/project/" + projectId + "/project-updates", JSON.stringify(status))
      }

      dataFactory.getRecurringTasks = function () {
        return $http.get(urlBase + "/tasks")
      }

      dataFactory.getRecurringTaskInstances = function (year) {
        return $http.get(urlBase + "/tasks/instances/" + year);
      }

      return dataFactory;
    }])

    .factory('jira', ['$http', function ($http) {
      var urlBase = 'https://libpm.ucr.edu/rest';
      var jiraFactory = {};

      jiraFactory.startSession = function () {
        $http({
          method: 'POST',
          url: urlBase + '/auth/1/session',
          data: { "username": "", "password": "" },
          headers: {
            "Content-Type": "application/json"
          }
        }).then(function (sucess) {
          console.log(success);
        }, function (error) {
          console.log(error);
        });
      }

      return jiraFactory;
    }]);
})();