(function () {
  // ===============================================================================
  // Controllers / RequestList
  //

  function RequestListCtrl($http, $state, $filter, bl, data, Auth, $scope) {
    var self = this;
    self.requests = [];

    self.getTotal = function () {
      var total = 0;
      for (var i = 0; i < self.requests.length; i++) {
        var request = self.requests[i];
        total += (request.cost * request.quantity);
      }
      return total;
    }

    self.sortableOptions = {
      stop: function (e, ui) {
        data.saveRequestPriorities(self.requests);
      },
      helper: function(e, tr)
      {
        var $originals = tr.children();
        var $helper = tr.clone();
        $helper.children().each(function(index)
        {
          // Set helper cell sizes to match the original sizes
          $(this).outerWidth($originals.eq(index).outerWidth());
        });
        return $helper;
      }
    };

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
          self.requests = $filter('orderBy')(self.requests, 'priority');

        }).catch(function (err) { console.log(err) });
    }

    self.loadRequests();
  }

  angular.module('pixeladmin')
    .controller('RequestListCtrl', RequestListCtrl);
})();