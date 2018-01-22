(function() {
  // ===============================================================================
  // Controllers / RecurringTasks
  //

  function RecurringTasksCtrl($http, $scope, $state, $filter, $anchorScroll, $location, bl, data) {
    var self = this;
    self.month = new Date().getMonth() + 1;
    self.year = new Date().getFullYear();
    self.months = [];
    self.tasks = [];
    self.instances = [];

    // Custom filter for showing tasks of a certain month
    // TODO: Figure out how to get this moved into filter.js
    $scope.byMonth = function(month) {
      return function(task) {
        return task.schedule[month].selected == true;
      }
    }

    function loadTasks() {
      // Build the month list
      for (var i = 1; i <= 12; i++) {
        var monthName = moment().month(i - 1).format('MMMM');
        var month = { id: i, name: monthName };
        self.months.push(month);
      }

      // Fetch all the tasks
      data.getRecurringTasks()
      .then(function(response) {
        self.tasks = response.data.Items;
      });

      // Fetch the task instance data
      data.getRecurringTaskInstances(self.year)
      .then(function(response) {
        self.instances = response.data.Items;
      });
    }

    // Kick off the initial load
    loadTasks();

    // Scroll to the current month tasks
    $location.hash('anchor' + self.month);
    $anchorScroll();
  }

  angular.module('pixeladmin')
    .controller('RecurringTasksCtrl', RecurringTasksCtrl);

})();