(function () {
  // ===============================================================================
  // Controllers / Request
  //

  function RequestCtrl($http, $stateParams, $anchorScroll, $location, $state, bl, data) {
    var self = this;
    var showUpdatedAlert = false;

    // Initialize with sensible defaults
    self.request = {
      type: 'Annual Equipment Request',
      createdby: ''  // TODO: Set the logged in username to a 'created by' field here
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
  }

  angular.module('pixeladmin')
    .controller('RequestCtrl', RequestCtrl);
})();