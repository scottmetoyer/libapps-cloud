(function () {

  angular.module('pixeladmin')
    .service('bl', function () {
      this.calculateStatus = function (project) {
        var status = { description: 'On track', class: 'text-success' };

        if (!project.hasProjectPlan) {
          status = { description: 'At risk', class: 'text-danger' };
        } else {
          if (!project.hasWiki || !project.hasJiraProject) {
            status = { description: 'Needs attention', class: 'text-warning' };
          }
        }

        return status;
      }
    })
    .service('authInterceptor', function ($q) {
      var service = this;

      service.responseError = function (response) {
        if (response.status == 401) {
          window.location = "/login";
        }
        return $q.reject(response);
      };
    });
})();