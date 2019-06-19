(function () {
  // ===============================================================================
  // Controllers / Project
  //

  function ProjectCtrl($http, $stateParams, $anchorScroll, $location, bl, data) {
    var self = this;

    // Initialize with sensible defaults
    self.project = {};
    self.statusUpdateList = {};
    self.statusUpdate = { 'user': 'Choose a team member...' };
    self.project.executionStatus = 'backlog';
    self.showStatusUpdateForm = false;

    self.saveStatusUpdate = function (isValid) {
      if (isValid) {
        self.statusUpdate.projectId = $stateParams.id;

        data.saveStatusUpdate(self.statusUpdate)
          .then(function (response) {
            getStatusUpdates($stateParams.id);
          }, function (response) {
            self.hasError = true;
          });
      }
    }

    self.cancelStatusUpdate = function () {
      self.showStatusUpdateForm = false;
      self.statusUpdate = { 'user': 'Choose a team member...' };
    }

    self.toggleStatusUpdateForm = function () {
      self.showStatusUpdateForm = !self.showStatusUpdateForm;
    }

    self.createProject = function (isValid) {
      if (isValid) {
        saveProject(function () {
          $location.path('/projects/in-flight').search({ new: 'true' });
        });
      }
    }

    self.updateProject = function (isValid) {
      if (isValid) {
        saveProject(function () {
          $location.path('/projects/view/' + self.project.id).search({ updated: 'true' });
        });
      }
    }

    function saveProject(callback) {
      data.saveProject(self.project)
        .then(function (response) {
          callback();
        }, function (response) {
          $anchorScroll();
          self.hasError = true;
        });
    }

    function getStatusUpdates(projectId) {
      data.getStatusUpdates(projectId)
        .then(function (response) {
          self.statusUpdateList = response.data;

          // Close the update form if it is open
          self.cancelStatusUpdate();
        }, function (response) {
          $anchorScroll();
          self.hasError = true;
        });
    }

    // Load up a project if we have passed an id in the state parameters
    if ($stateParams.id) {
      data.getProjects($stateParams.id)
        .then(function (response) {
          self.project = response.data.Item;

          if (self.project != null) {
            self.project.status = bl.calculateStatus(self.project);

            // Toggle visibility on the new and updated project indicators
            if ('new' in $location.search()) {
              self.showCreatedAlert = true;
            }

            if ('updated' in $location.search()) {
              self.showUpdatedAlert = true;
            }
          } else {
            self.hasError = true;
          }

          // Load up the project status updates
          getStatusUpdates($stateParams.id);
        }, function (response) {
          $anchorScroll();
          self.hasError = true;
        });
    }
  }

  angular.module('pixeladmin')
    .controller('ProjectCtrl', ProjectCtrl);

})();