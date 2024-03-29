(function () {
  // ===============================================================================
  // Controllers / Request
  //

  function RequestCtrl($http, $stateParams, $anchorScroll, $location, $state, $scope, $q, bl, data, Auth) {
    var self = this;
    var showUpdatedAlert = false;
    self.activityCodes = data.getActivityCodes();
    self.requestTypes = bl.getRequestTypes();
    self.comment = {
      text: '',
      avatar: Auth.getUser().picture,
      user: Auth.getUser().name
    };

    // Initialize with sensible defaults
    self.request = {
      type: 'Annual Equipment Request',
      createdBy: Auth.getUser().name,
      requesterPriority: 0,
      status: 'new'
    };

    self.create = function (isValid) {
      if (isValid) {
        console.log(self.request.isStudentTechFee);

        if (self.request.isStudentTechFee == true) {
          self.request.type = 'Student Tech Fee Request';
        }

        saveRequest(function () {
          $state.go('requests.annual-equipment-request-submitted');
        });
      }
    }

    self.update = function (isValid) {
      if (isValid) {
        saveRequest(function () {
          $location.path('/requests/view/' + self.request.id).search({ updated: 'true' });
        });
      }
    }

    self.saveComment = function(isValid) {
      if (isValid) {
        if (!self.request.comments) {
          self.request.comments = [];
        }
  
        self.comment.timestamp = Date.now();
        self.request.comments.push(angular.copy(self.comment));
  
        saveRequest(function(){
          self.comment.text = '';
        });
      }
    }

    self.loadTags = function(query) {
      var tags = [
        { 'text': 'Public Workstations' },
        { 'text': 'Laptops' },
        { 'text': 'Book Scanners' },
        { 'text': 'Displays' },
        { 'text': 'Software' },
        { 'text': 'Makerspace' },
        { 'text': 'Support Staffing' },
      ];
      var deferred = $q.defer();
      deferred.resolve(tags);
      return deferred.promise;
    }

    var saveRequest = function(callback) {
      data.saveRequest(self.request)
      .then(function (response) {
        callback();
      }, function (response) {
        $anchorScroll();
        self.hasError = true;
      });
    }

    // Load up a request if we have passed an id in the state parameters
    if ($stateParams.id) {
      data.getRequests($stateParams.id)
        .then(function (response) {
          self.request = response.data.Item;

          if (self.request != null) { }
          else {
            self.hasError = true;
          }

          if ('updated' in $location.search()) {
            self.showUpdatedAlert = true;
          }
        }, function (response) {
          $anchorScroll();
          self.hasError = true;
        });
    }

    // Check the heartbeat to make sure we're still logged in
    data.heartbeat();
  }

  angular.module('pixeladmin')
    .controller('RequestCtrl', RequestCtrl);
})();