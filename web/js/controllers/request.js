(function() {
  // ===============================================================================
  // Controllers / Request
  //

  function RequestCtrl($http, $stateParams, $anchorScroll, $location, bl, data) {
    var self = this;

    // Initialize with sensible defaults
    self.request = {};

    self.save = function(isValid) {
      if (isValid) {
        self.statusUpdate.projectId = $stateParams.id;

        data.saveStatusUpdate(self.statusUpdate)
        .then(function(response) {
          getStatusUpdates($stateParams.id);
        }, function(response){
          self.hasError = true;
        });
      }
    }

    self.create = function(isValid) {
      if (isValid) {
        saveProject(function(){
          $location.path('/pages/create-project/' + self.project.id).search({ new: 'true' });
        });
      }
    }
  }

  angular.module('pixeladmin')
    .controller('RequestCtrl', RequestCtrl);
})();