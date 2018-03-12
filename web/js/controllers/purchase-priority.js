(function () {
  // ===============================================================================
  // Controllers / PurchasePriorityCtrl
  //

  function PurchasePriorityCtrl($http, $scope, $state, $filter, $anchorScroll, $location, bl, data, Auth) {
    var self = this;
    self.ready = false;
    self.requests = [];
    self.prioritized = [];
    self.denied = [];
    self.prioritizedTags = [];
    self.selected;

    self.allocatedBudget = 200000;
    self.totalRequestedCost = 0;
    self.totalPrioritizedCost = 0;
    self.balance = 0;

    self.getTotal = function () {
      var total = 0;
      for (var i = 0; i < self.requests.length; i++) {
        var request = self.requests[i];
        total += (request.cost * request.quantity);
      }
      return total;
    }

    self.calculateTotalPrioritizedCost = function () {
      var total = 0;
      self.prioritizedTags = [];

      self.prioritized.forEach(function (e) {
        total += (e.cost * e.quantity);

        if (e.tags) {
          e.tags.forEach(function (t) {
            var tag = self.prioritizedTags.find(tag => (tag.text == t.text));

            if (!tag) {
              t.total = (e.cost * e.quantity);
              self.prioritizedTags.push(t);
            } else {
              tag.total += (e.cost * e.quantity);
            }
          })
        }
      });

      self.prioritizedTags = $filter('orderBy')(self.prioritizedTags, ['text']);
      self.totalPrioritizedCost = total;
      self.balance = self.allocatedBudget - self.totalPrioritizedCost;
    }

    self.calculateTotalRequestedCost = function () {
      var total = 0;

      self.requests.forEach(function (e) {
        total += (e.cost * e.quantity);
      });

      self.totalRequestedCost = total;
    }

    self.setSelected = function (id) {
      self.selected = id;
    }

    self.toPrioritized = function (index) {
      var item = self.requests.splice(index, 1);
      self.prioritized.push(item[0]);
      self.prioritized = $filter('orderBy')(self.prioritized, ['aulPriority']);
      self.calculateTotalPrioritizedCost();

      // Set the request status
      data.setRequestStatus(item[0], 'prioritized');

      // Persist the prioritization order
      data.saveRequestPriorities(self.prioritized, 'aul');
    }

    self.toDenied = function (index) {
      var item = self.requests.splice(index, 1);
      self.denied.push(item[0]);

      // Set the request status
      data.setRequestStatus(item[0], 'denied');
    }

    self.toSubmitted = function (index, source) {
      var item = source.splice(index, 1);
      self.requests.push(item[0]);
      self.requests = $filter('orderBy')(self.requests, ['createdBy', 'requesterPriority']);
      self.calculateTotalPrioritizedCost();

      // Set the request status
      data.setRequestStatus(item[0], 'new');

      // Persist the prioritized list
      // data.saveRequestPriorities(self.prioritized, 'aul');
    }

    self.sortableOptions = {
      stop: function (e, ui) {
        data.saveRequestPriorities(self.prioritized, 'aul');
      },
      helper: function (e, tr) {
        var $originals = tr.children();
        var $helper = tr.clone();
        $helper.children().each(function (index) {
          // Set helper cell sizes to match the original sizes
          $(this).outerWidth($originals.eq(index).outerWidth());
        });
        return $helper;
      }
    };

    self.aulPrioritizedFilter = function (request) {
      return request.status == 'prioritized';
    }

    self.aulDeniedFilter = function (request) {
      return request.status == 'denied';
    }

    self.unPrioritizedFilter = function (request) {
      return request.status == 'new';
    }

    self.loadRequests = function () {
      data.getRequests()
        .then(function (response) {
          var items = response.data.Items;
          self.requests = items;
          self.requests = $filter('orderBy')(self.requests, ['createdBy', 'requesterPriority']);
          self.calculateTotalRequestedCost();

          // Move prioritized and denied requests to the their respective lists
          self.prioritized = $filter('filter')(self.requests, self.aulPrioritizedFilter);
          self.prioritized = $filter('orderBy')(self.prioritized, ['aulPriority']);
          self.denied = $filter('filter')(self.requests, self.aulDeniedFilter);

          // Remove dispositioned requests from the submitted list
          self.requests = $filter('filter')(self.requests, self.unPrioritizedFilter);

          self.calculateTotalPrioritizedCost();

          self.ready = true;
        }).catch(function (err) { console.log(err) });
    }

    self.loadRequests();
  }

  angular.module('pixeladmin')
    .controller('PurchasePriorityCtrl', PurchasePriorityCtrl);
})();