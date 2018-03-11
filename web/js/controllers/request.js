(function () {
  // ===============================================================================
  // Controllers / Request
  //

  function RequestCtrl($http, $stateParams, $anchorScroll, $location, $state, $scope, bl, data, Auth) {
    var self = this;
    var showUpdatedAlert = false;
    self.costCenters = data.getCostCenters();

    // Initialize with sensible defaults
    self.request = {
      type: 'Annual Equipment Request',
      createdBy: Auth.getUser().name,
      requesterPriority: 0
    };

    self.create = function (isValid) {
      if (isValid) {
        saveRequest(function () {
          $state.go('requests.annual-equipment-request-submitted');
        });
      }
    }

    self.update = function (isValid) {
      if (isValid) {
        saveRequest(function () {
          $location.path('/requests/view/' + self.request.id).search({ updated: 'true' });
        });
      }
    }

    var saveRequest = function(callback) {
      data.saveRequest(self.request)
      .then(function (response) {
        callback();
      }, function (response) {
        $anchorScroll();
        self.hasError = true;
      });
    }

    // Load up a request if we have passed an id in the state parameters
    if ($stateParams.id) {
      data.getRequests($stateParams.id)
        .then(function (response) {
          self.request = response.data.Item;

          if (self.request != null) { }
          else {
            self.hasError = true;
          }

          if ('updated' in $location.search()) {
            self.showUpdatedAlert = true;
          }
        }, function (response) {
          $anchorScroll();
          self.hasError = true;
        });
    }

    // Check the heartbeat to make sure we're still logged in
    data.heartbeat();
  }

  angular.module('pixeladmin')
    .controller('RequestCtrl', RequestCtrl);
})();