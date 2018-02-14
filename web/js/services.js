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
    .service('User', function (store) {
      var service = this;
      var currentUser = null;

      service.setCurrentUser = function (user) {
        currentUser = user;
        store.set('user', user);
        return currentUser;
      };

      service.getCurrentUser = function () {
        if (!currentUser) {
          currentUser = store.get('user');
        }
        return currentUser;
      };
    })
    .service('Auth', function(angularAuth0){
      var service = this;

      service.login = function() {
        angularAuth0.authorize();
      }
    })
})();