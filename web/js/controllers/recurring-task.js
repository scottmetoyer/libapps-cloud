(function() {
  // ===============================================================================
  // Controllers / RecurringTask
  //

  function RecurringTaskCtrl($http, $scope, $state, $filter, $anchorScroll, $location, $stateParams, bl, data) {
    var self = this;

    // Initialize with sensible defaults
    self.task = {
      schedule: [
        { name: "Jan", selected: false },
        { name: "Feb", selected: false },
        { name: "Mar", selected: false },
        { name: "Apr", selected: false },
        { name: "May", selected: false },
        { name: "Jun", selected: false },
        { name: "Jul", selected: false },
        { name: "Aug", selected: false },
        { name: "Sep", selected: false },
        { name: "Oct", selected: false },
        { name: "Nov", selected: false },
        { name: "Dec", selected: false }
      ]
    };
  
    self.createTask = function (isValid) {
      if (isValid) {
        saveTask(function () {
          $location.path('/recurring-tasks/list').search({ new: 'true' });
        });
      }
    }

    self.updateTask = function(isValid) {
      if (isValid) {
        saveTask(function(){
          $location.path('/recurring-tasks/list').search({ updated: 'true' });;
        });
      }
    }

    function saveTask(callback) {
      data.saveRecurringTask(self.task)
        .then(function (response) {
          callback();
        }, function (response) {
          $anchorScroll();
          self.hasError = true;
        });
    }

    if ($stateParams.id) {
      data.getRecurringTasks($stateParams.id)
        .then(function (response) {
          self.task = response.data.Item;

          if (self.task === null) {
            self.hasError = true;
          }
        }, function (response) {
          $anchorScroll();
          self.hasError = true;
        });
    }
  }

  angular.module('pixeladmin')
    .controller('RecurringTaskCtrl', RecurringTaskCtrl);
})();