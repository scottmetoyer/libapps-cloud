(function () {
  // ===============================================================================
  // Controllers / PurchasePriorityCtrl
  //

  function PurchasePriorityCtrl($http, $scope, $state, $filter, $anchorScroll, $location, bl, data, Auth) {
    var self = this;
    self.ready = false;
    self.requests = [];
    self.prioritized = [];
    self.needsReview = [];
    self.prioritizedTags = [];
    self.selected;
    self.overBudgetTrigger;

    self.allocatedBudget = 0;
    self.totalRequestedAmount = 0;
    self.totalPrioritizedAmount = 0;
    self.totalNeedsReviewAmount = 0;
    self.balance = 0;

    self.requestTypes = bl.getRequestTypes();
    self.requestType = self.requestTypes[0];

    self.getTotal = function () {
      var total = 0;
      for (var i = 0; i < self.requests.length; i++) {
        var request = self.requests[i];

        if (request.cost && request.quantity) {
          request.cost && request.quantity ? total += (request.cost * request.quantity) : null;
        }
      }
      return total;
    };

    self.calculateTotalNeedsReviewAmount = function() {
      var total = 0;
      self.needsReview.forEach(function (e) {
        e.cost && e.quantity ? total += (e.cost * e.quantity) : null;
      });

      self.totalNeedsReviewAmount = total;
    };

    self.calculateTotalPrioritizedAmount = function () {
      var total = 0;
      self.prioritizedTags = [];
      self.overBudgetTrigger = '';

      self.prioritized.forEach(function (e) {
        e.cost && e.quantity ? total += (e.cost * e.quantity) : null;

        if (total > self.allocatedBudget && self.overBudgetTrigger === '') {
          self.overBudgetTrigger = e.id;
        }

        if (e.tags) {
          e.tags.forEach(function (t) {
            var tag = self.prioritizedTags.find(tag => (tag.text == t.text));

            if (e.cost && e.quantity) {
              if (!tag) {
                t.total = (e.cost * e.quantity);
                self.prioritizedTags.push(t);
              } else {
                tag.total += (e.cost * e.quantity);
              }
            }
          })
        }
      });

      self.prioritizedTags = $filter('orderBy')(self.prioritizedTags, ['text']);
      self.totalPrioritizedAmount = total;
      self.balance = self.allocatedBudget - self.totalPrioritizedAmount;
    };

    self.calculateTotalRequestedAmount = function () {
      var total = 0;

      self.requests.forEach(function (e) {
        e.cost && e.quantity ? total += (e.cost * e.quantity) : null;
      });

      self.totalRequestedAmount = total;
    };

    self.setSelected = function (id) {
      self.selected = id;
    };

    self.toPrioritized = function (index) {
      var item = self.requests.splice(index, 1);
      self.prioritized.push(item[0]);
      self.prioritized = $filter('orderBy')(self.prioritized, ['aulPriority']);
      self.calculateTotalPrioritizedAmount();

      // Set the request status
      data.setRequestStatus(item[0], 'prioritized');

      // Persist the prioritization order
      data.saveRequestPriorities(self.prioritized, 'aul');
    };

    self.toNeedsReview = function (index) {
      var item = self.requests.splice(index, 1);
      self.needsReview.push(item[0]);
      self.calculateTotalNeedsReviewAmount();

      // Set the request status
      data.setRequestStatus(item[0], 'needsReview');
    };

    self.toSubmitted = function (index, source) {
      var item = source.splice(index, 1);
      self.requests.push(item[0]);
      self.requests = $filter('orderBy')(self.requests, ['createdBy', 'requesterPriority']);
      self.calculateTotalPrioritizedAmount();
      self.calculateTotalNeedsReviewAmount();
      
      // Set the request status
      data.setRequestStatus(item[0], 'new');
    };

    self.setApproval = function(index, value) {
      self.prioritized[index].approval = value;
    }

    self.sortableOptions = {
      stop: function (e, ui) {
        data.saveRequestPriorities(self.prioritized, 'aul');
        self.calculateTotalPrioritizedAmount();
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
    };

    self.aulNeedsReviewFilter = function (request) {
      return request.status == 'needsReview';
    };

    self.unPrioritizedFilter = function (request) {
      return request.status == 'new';
    };

    self.loadRequests = function () {
      if (self.requestType == "Annual Equipment Request") {
        self.allocatedBudget = 200000;
      } else if (self.requestType == "Student Tech Fee Request") {
        self.allocatedBudget = 15000;
      }

      data.getRequests(null, self.requestType)
        .then(function (response) {
          var items = response.data.Items;
          self.requests = items;
          self.requests = $filter('orderBy')(self.requests, ['createdBy', 'requesterPriority']);
          self.calculateTotalRequestedAmount();

          // Move prioritized and needs review requests to the their respective lists
          self.prioritized = $filter('filter')(self.requests, self.aulPrioritizedFilter);
          self.prioritized = $filter('orderBy')(self.prioritized, ['aulPriority']);
          self.needsReview = $filter('filter')(self.requests, self.aulNeedsReviewFilter);

          // Remove dispositioned requests from the submitted list
          self.requests = $filter('filter')(self.requests, self.unPrioritizedFilter);

          self.calculateTotalPrioritizedAmount();
          self.calculateTotalNeedsReviewAmount();

          self.ready = true;
        }).catch(function (err) { console.log(err) });
    };

    self.loadRequests();
  }

  angular.module('pixeladmin')
    .controller('PurchasePriorityCtrl', PurchasePriorityCtrl);
})();