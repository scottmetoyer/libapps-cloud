(function () {
  // ===============================================================================
  // Controllers / Request
  //

  function RequestCtrl($http, $stateParams, $anchorScroll, $location, bl, data) {
    var self = this;

    // Initialize with sensible defaults
    self.request = {
      type: 'Annual Equipment Request'
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
  }

  angular.module('pixeladmin')
    .controller('RequestCtrl', RequestCtrl);
})();