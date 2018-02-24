(function () {
  // ===============================================================================
  // Controllers / Request
  //

  function RequestCtrl($http, $stateParams, $anchorScroll, $location, $state, bl, data) {
    var self = this;

    // Initialize with sensible defaults
    self.request = {
      type: 'Annual Equipment Request',
      createdby: ''  // TODO: Set the logged in username to a 'created by' field here
    };

    self.create = function (isValid) {
      if (isValid) {
        data.saveRequest(self.request)
          .then(function (response) {
            // Show the success wizard step
            $state.go('requests.annual-equipment-request-submitted');
          }, function (response) {
            self.hasError = true;
          });
      }
    }

    // Load up a request if we have passed an id in the state parameters
    if ($stateParams.id) {
      data.getRequests($stateParams.id)
        .then(function (response) {
          self.request = response.data.Items[0];

          if (self.request != null) { }
          else {
            self.hasError = true;
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