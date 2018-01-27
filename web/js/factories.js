(function () {

  angular.module('pixeladmin')
    .factory('data', ['$http', function ($http) {
      var urlBase = 'https://nlm8zahqm4.execute-api.us-west-1.amazonaws.com/test';
      var dataFactory = {};

      dataFactory.getProjects = function (key) {
        if (key) {
          return $http.get(urlBase + '/projects/' + key);
        } else {
          return $http.get(urlBase + '/projects');
        }
      }

      dataFactory.saveProject = function (project) {
        return $http.post(urlBase + "/projects", JSON.stringify(project));
      }

      dataFactory.getStatusUpdates = function (key) {
        return $http.get(urlBase + '/project-updates/' + key);
      }

      dataFactory.saveStatusUpdate = function (status) {
        return $http.post(urlBase + "/project-updates", JSON.stringify(status))
      }

      dataFactory.saveProjectStatus = function (newStatus, key) {
        var postData = { key: key, executionStatus: newStatus };
        return $http.post(urlBase + '/projects/' + key + '/execution-status', angular.toJson(postData))
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