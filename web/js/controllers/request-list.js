(function () {
  // ===============================================================================
  // Controllers / RequestList
  //

  function RequestListCtrl($http, $state, $filter, bl, data, Auth) {
    var self = this;
    self.requests = [];

    self.getTotal = function() {
      var total = 0;
      for(var i = 0; i < self.requests.length; i++){
          var request = self.requests[i];
          total += (request.cost * request.quantity);
      }
      return total;
    }

    self.loadRequests = function () {
      data.getRequests()
        .then(function (response) {
          var items = response.data.Items;
          self.requests = items;

          // Filter the list based on the current user
          var user = Auth.getUser().name;
          self.requests = items.filter(function (request) {
            return (request.createdBy == user);
          });

        }).catch(function (err) { console.log(err) });
    }

    self.loadRequests();
  }

  angular.module('pixeladmin')
    .controller('RequestListCtrl', RequestListCtrl);
})();