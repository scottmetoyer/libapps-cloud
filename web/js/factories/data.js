(function () {

  angular.module('pixeladmin')
    .factory('data', ['$http', '__env', function ($http, __env) {
      var urlBase = __env.apiUrl;
      var dataFactory = {};

      // Check to make sure we can still get to our data services
      dataFactory.heartbeat = function () {
        $http.get(__env.apiUrl + '/heartbeat');
      }

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

      dataFactory.getRecurringTasks = function (id) {
        if (id) {
          return $http.get(urlBase + "/recurring-task/" + id)
        } else {
          return $http.get(urlBase + "/recurring-tasks")
        }
      }

      dataFactory.saveRecurringTask = function (task) {
        if (task.id) {
          return $http.put(urlBase + "/recurring-task/" + task.id, JSON.stringify(task));
        } else {
          return $http.post(urlBase + "/recurring-tasks", JSON.stringify(task));
        }
      }

      dataFactory.getRecurringTaskInstances = function (year) {
        return $http.get(urlBase + "/recurring-tasks/instances/" + year);
      }

      dataFactory.saveRequest = function (request) {
        if (request.id != null) {
          return $http.put(urlBase + "/request/" + request.id, JSON.stringify(request));
        } else {
          return $http.post(urlBase + "/requests", JSON.stringify(request));
        }
      }

      dataFactory.getRequests = function (id, type) {
        if (id) {
          return $http.get(urlBase + '/request/' + id);
        } else {
          return $http.get(urlBase + '/requests?type=' + (type ? type : ''));
        }
      }

      dataFactory.setRequestStatus = function (request, status) {
        request.status = status;
        return $http.put(urlBase + '/request-status', JSON.stringify(request));
      }

      dataFactory.setPurchaseApproval = function (request, approval) {
        return $http.put(urlBase + '/purchase-approval', JSON.stringify({
          id: request.id,
          approval: approval
        }));
      }

      dataFactory.saveRequestPriorities = function (requests, type) {
        var data = {
          type: type,
          requests: requests
        };

        return $http.put(urlBase + '/purchase-priority', JSON.stringify(data));
      }

      dataFactory.getActivityCodes = function () {
        var activityCodes = [{
            description: 'A01453 | Teaching & Learning - Library',
            code: 'A01453'
          },
          {
            description: 'A01172 | Special Research Proj-Library',
            code: 'A01172'
          },
          {
            description: 'A01455 | M&TS Special Materials/Languag',
            code: 'A01455'
          },
          {
            description: 'A01140 | Special Collect/Archives - Lib',
            code: 'A01140'
          },
          {
            description: 'A02461 | Research Services - Library',
            code: 'A02461'
          },
          {
            description: 'A01454 | M&TS Records Auth & Meta Mgmt',
            code: 'A01454'
          },
          {
            description: 'A01170 | Preservation - Library',
            code: 'A01170'
          },
          {
            description: 'A01173 | Music - Library',
            code: 'A01173'
          },
          {
            description: 'A01168 | Medical Library Services',
            code: 'A01168'
          },
          {
            description: 'A02462 | Library Security',
            code: 'A02462'
          },
          {
            description: 'A01165 | Library Gen Operations',
            code: 'A01165'
          },
          {
            description: 'A01171 | Interlibrary Loans',
            code: 'A01171'
          },
          {
            description: 'A01536 | Library Facilities',
            code: 'A01536'
          },
          {
            description: 'A01565 | Digitation Services - Library',
            code: 'A01565'
          },
          {
            description: 'A01588 | Cyber Infrastructure - Library',
            code: 'A01588'
          },
          {
            description: 'A01451 | Communications - Library',
            code: 'A01451'
          },
          {
            description: 'A01174 | Collections Strategy - Library',
            code: 'A01174'
          },
          {
            description: 'A01167 | Collections Maint Bin-Library',
            code: 'A01167'
          },
          {
            description: 'A01166 | Circulation/Reserves - Library',
            code: 'A01166'
          },
          {
            description: 'A01169 | Books / Acquisitions - Library',
            code: 'A01169'
          }
        ];

        return activityCodes;
      }

      return dataFactory;
    }])
})();