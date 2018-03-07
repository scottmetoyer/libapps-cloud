(function() {
    // ===============================================================================
    // Controllers / PurchasePriorityCtrl
    //
  
    function PurchasePriorityCtrl($http, $scope, $state, $filter, $anchorScroll, $location, bl, data, Auth) {
        var self = this;
        self.ready = false;
        self.requests = [];
        self.prioritized = [];
        self.denied = [];
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

        self.calculateTotalPrioritizedCost = function() {
          var total = 0;

          self.prioritized.forEach(function(e) {
            total += (e.cost * e.quantity);
          });

          self.totalPrioritizedCost = total;
          self.balance = self.allocatedBudget - self.totalPrioritizedCost;
        }

        self.calculateTotalRequestedCost = function() {
          var total = 0;

          self.requests.forEach(function(e) {
            total += (e.cost * e.quantity);
          });

          self.totalRequestedCost = total;
        }

        self.setSelected = function(id) {
            self.selected = id;
        }

        self.toPrioritized = function(index) {
          var item = self.requests.splice(index, 1);
          self.prioritized.push(item[0]);
          self.calculateTotalPrioritizedCost();
        }

        self.toDenied = function(index) {
          var item = self.requests.splice(index, 1);
          self.denied.push(item[0]);
        }

        self.toSubmitted = function(index, source) {
          var item = source.splice(index, 1);
          self.requests.push(item[0]);
          self.calculateTotalPrioritizedCost();
        }
    
        self.sortableOptions = {
          stop: function (e, ui) {
            // data.saveRequestPriorities(self.requests);
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
              self.requests = $filter('orderBy')(self.requests, ['createdBy', 'priority']);
              self.calculateTotalRequestedCost();
              self.calculateTotalPrioritizedCost();

              self.ready = true;
            }).catch(function (err) { console.log(err) });
        }
    
        self.loadRequests();
    }
  
    angular.module('pixeladmin')
      .controller('PurchasePriorityCtrl', PurchasePriorityCtrl);
  })();