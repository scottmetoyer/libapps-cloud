(function () {
  // ===============================================================================
  // Controllers / RequestList
  //

  function RequestListCtrl($http, $state, $filter, bl, data) {
    var self = this;
    self.requests = [];

    self.loadRequests = function () {
      data.getRequests()
        .then(function (response) {
          var items = response.data.Items;
          self.requests = items;
          // Filter the list based on logged in username
        }).catch(function (err) { console.log(err) });
    }

    self.loadRequests();
  }

  angular.module('pixeladmin')
    .controller('RequestListCtrl', RequestListCtrl);
})();