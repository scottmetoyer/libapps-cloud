(function() {
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

    self.saveStatusUpdate = function(isValid) {
      if (isValid) {
        self.statusUpdate.key = $stateParams.key;

        data.saveStatusUpdate(self.statusUpdate)
        .then(function(response) {
          getStatusUpdates($stateParams.key);
        }, function(response){
          self.hasError = true;
        });
      }
    }

    self.cancelStatusUpdate = function() {
      self.showStatusUpdateForm = false;
      self.statusUpdate = { 'user': 'Choose a team member...' };
    }

    self.toggleStatusUpdateForm = function() {
      self.showStatusUpdateForm = !self.showStatusUpdateForm;
    }

    self.createProject = function(isValid) {
      if (isValid) {
        self.project.key = self.project.key.toUpperCase();

        saveProject(function(){
          $location.path('/pages/view-project/' + self.project.key).search({ new: 'true' });
        });
      }
    }

    self.updateProject = function(isValid) {
      if (isValid) {
        saveProject(function(){
          $location.path('/pages/view-project/' + self.project.key).search({ updated: 'true' });
        });
      }
    }

    function saveProject(callback) {
      data.saveProject(self.project)
      .then(function(response) {
        callback();
      }, function(response){
        $anchorScroll();
        self.hasError = true;
      });
    }

    function getStatusUpdates(key) {
      data.getStatusUpdates(key)
      .then(function(response) {
        self.statusUpdateList = response.data;

        // Close the update form if it is open
        self.cancelStatusUpdate();
      }, function(response){
        $anchorScroll();
        self.hasError = true;
      });
    }

    // Load up a project if we have passed a key in the state parameters
    if ($stateParams.key) {
      data.getProjects($stateParams.key)
      .then(function(response) {
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
        getStatusUpdates($stateParams.key);
      }, function(response){
        $anchorScroll();
        self.hasError = true;
      });
    }
  }

  angular.module('pixeladmin')
    .controller('ProjectCtrl', ProjectCtrl);

})();