(function() {
  // ===============================================================================
  // Controllers / ProjectList
  //

  function ProjectListCtrl($http, $state, $filter, bl, data, jira, cognito) {
    var self = this;
    self.projects = [];

    self.moveToInFlight = function(key) {
      data.saveProjectStatus('in-flight', key)
      .then(function(response) {
        loadProjects();
      });
    }

    self.moveToBacklog = function(key) {
      data.saveProjectStatus('backlog', key)
      .then(function(response) {
        loadProjects();
      });
    }

    function loadProjects() {
      // Test AWS Cognito functions
      var userPool = cognito.getUserPool();
      var currentUser = userPool.getCurrentUser();
      console.log(currentUser);

      data.getProjects()
      .then(function(response) {
        var items = response.data.Items;

        // Filter the list based on route
        if ($state.current.name == 'pages.backlog') {
          self.projects = items.filter(function(project) {
            return (project.executionStatus == 'backlog');
          });
        } else if ($state.current.name == 'pages.archive') {
          self.projects = items.filter(function(project) {
            return (project.executionStatus == 'archive');
          });
        } else {
          self.projects = items.filter(function(project) {
            return (project.executionStatus == 'in-flight');
          });

          self.projects.forEach(function(project) {
            project.status = bl.calculateStatus(project);

            data.getStatusUpdates(project.key)
            .then(function(res) {
              var list = res.data.Items;

              if (list.length > 0) {
                list = $filter('orderBy')(list, "created", true);
                project.latestUpdate = list[0];
              }
            }, function(response){
              // Error loading status updates for this project
              console.log(err);
            });
          })
        }
      });
    }

    // Kick off the initial load
    loadProjects();
  }

  angular.module('pixeladmin')
    .controller('ProjectListCtrl', ProjectListCtrl);
})();