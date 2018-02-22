(function () {
  // ===============================================================================
  // Controllers / ProjectList
  //

  function ProjectListCtrl($http, $state, $filter, bl, data) {
    var self = this;
    self.projects = [];

    self.loadProjects = function () {
      data.getProjects()
        .then(function (response) {
          var items = response.data.Items;

          // Filter the list based on route
          if ($state.current.name == 'projects.backlog') {
            self.projects = items.filter(function (project) {
              return (project.executionStatus == 'backlog');
            });
          } else if ($state.current.name == 'projects.archive') {
            self.projects = items.filter(function (project) {
              return (project.executionStatus == 'archive');
            });
          } else if ($state.current.name == 'projects.in-flight') {
            self.projects = items.filter(function (project) {
              return (project.executionStatus == 'in-flight');
            });

            self.projects.forEach(function (project) {
              project.status = bl.calculateStatus(project);

              data.getStatusUpdates(project.id)
                .then(function (res) {
                  var list = res.data.Items;

                  if (list.length > 0) {
                    list = $filter('orderBy')(list, "timestamp", true);
                    project.latestUpdate = list[0];
                  }
                }, function (err) {
                  // Error loading status updates for this project
                  console.log(err);
                });
            })
          }
        }).catch(function (err) { console.log(err) });
    }

    self.loadProjects();
  }

  angular.module('pixeladmin')
    .controller('ProjectListCtrl', ProjectListCtrl);
})();