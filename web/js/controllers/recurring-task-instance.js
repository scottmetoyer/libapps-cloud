(function() {
  // ===============================================================================
  // Controllers / RecurringTaskInstance
  //

  function RecurringTaskInstanceCtrl($http, $scope, $state, $filter, $location, bl) {
    var self = this;
    self.instance = {
      year: '',
      month: '',
      taskId: '',
      caseNumber: '',
      completed: false
    }

    self.setCompleted = function(completed) {
      console.log(completed);
      self.instance.completed = completed;
    }

    self.init = function(instance) {
      self.instance = instance;

      // Load up the instance from the server

    }
  }

  angular.module('pixeladmin')
    .controller('RecurringTaskInstanceCtrl', RecurringTaskInstanceCtrl);

})();