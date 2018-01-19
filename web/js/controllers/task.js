(function() {
  // ===============================================================================
  // Controllers / Task
  //

  function TaskCtrl($http, $stateParams, $anchorScroll, $location, bl) {
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

    self.createTask = function(isValid) {
      if (isValid) {
        saveTask(function(){
          $location.path('/pages/recurring-tasks');
        });
      }
    }

    self.updateTask = function(isValid) {
      if (isValid) {
        saveTask(function(){
          $location.path('/pages/recurring-tasks');
        });
      }
    }

    function saveTask(callback){
      $http.post("https://nlm8zahqm4.execute-api.us-west-1.amazonaws.com/test/tasks", angular.toJson(self.task))
      .then(function(response) {
        callback();
      }, function(response){
        $anchorScroll();
        self.hasError = true;
      });
    }

    // Load up a task if we have passed an in the state parameters
    if ($stateParams.id) {
      $http.get("https://nlm8zahqm4.execute-api.us-west-1.amazonaws.com/test/tasks/" + $stateParams.id)
      .then(function(response) {
        self.task = response.data.Item;

        if (self.task == null) {
          self.hasError = true;
        }
      }, function(response){
        $anchorScroll();
        self.hasError = true;
      });
    }
  }

  angular.module('pixeladmin')
    .controller('TaskCtrl', TaskCtrl);

})();