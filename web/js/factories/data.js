(function () {

  angular.module('pixeladmin')
    .factory('data', ['$http', '__env', function ($http, __env) {
      var urlBase = __env.apiUrl;
      var dataFactory = {};

      // Check to make sure we can still get to our data services
      dataFactory.heartbeat = function() {
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

      dataFactory.getRequests = function (id) {
        if (id) {
          return $http.get(urlBase + '/request/' + id);
        } else {
          return $http.get(urlBase + '/requests');
        }
      }

      dataFactory.saveRequestPriorities = function(requests) {
        return $http.put(urlBase + '/request-priority', JSON.stringify(requests));
      }

      dataFactory.getCostCenters = function() {
        var costCenters = [
          { description: 'Access Services',	code: 'ALSLA' },
          { description: 'Acquisitions Accounting',	code: 'ALACQ' },
          { description: 'Acquisitions Unit',	code: 'ALAUA' },
          { description: 'Circulation Reserves',	code: 'ALCCR' },
          { description: 'Collection Maintenance',	code: 'ALCM' },
          { description: 'Collection Services',	code: 'ALCDD' },
          { description: 'Communications',	code: 'LCOM' },
          { description: 'Cyberinfrastructure',	code: 'ALLS' },
          { description: 'Digital Initiatives',	code: 'ALDIP' },
          { description: 'Facilities',	code: 'ALLR' },
          { description: 'Interlibrary Loan',	code: 'ALGI' },
          { description: 'Library Administration',	code: 'ALAD' },
          { description: 'Library Security Services',	code: 'ALSS' },
          { description: 'Medical Library Programs',	code: 'ALMLS' },
          { description: 'Metadata and Technical Services',	code: 'ALTS' },
          { description: 'Music Library',	code: 'ALMU' },
          { description: 'Preservation Services',	code: 'ALPA' },
          { description: 'Records, Authority, Metadata',	code: 'ALRAM' },
          { description: 'Research Services',	code: 'ALISD' },
          { description: 'Special Collections & University Archives',	code: 'ALCS' },
          { description: 'Special Materials and Language',	code: 'ALSML' },
          { description: 'Teaching & Learning',	code: 'ALRR' }
        ];

        return costCenters;
      }

      return dataFactory;
    }])
})();