(function() {
  // ===============================================================================
  // Controllers / ProjectList
  //

  function ProjectListCtrl($http, $state, $filter, bl, data, Auth) {
    var self = this;
    self.projects = [];

    self.testLogin = function() {
      Auth.login();
    }

    function loadProjects() {
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

            data.getStatusUpdates(project.id)
            .then(function(res) {
              var list = res.data.Items;

              if (list.length > 0) {
                list = $filter('orderBy')(list, "timestamp", true);
                project.latestUpdate = list[0];
              }
            }, function(response){
              // Error loading status updates for this project
              console.log(err);
            });
          })
        }
      }).catch(function(err){ console.log(err)} );
    }

    // Kick off the initial load
    loadProjects();
  }

  angular.module('pixeladmin')
    .controller('ProjectListCtrl', ProjectListCtrl);
})();