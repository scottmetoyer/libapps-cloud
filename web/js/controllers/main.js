(function() {
  // ===============================================================================
  // Controllers / Main
  //

  function MainCtrl($scope, $state, Auth) {
    var main = this;
    main.companyName = 'UCR Library';
    main.user = {};

    main.logout = function() {
      Auth.logout();
    }

    $scope.$on('user-login', function(event, args){
      main.user = args;
    });
  }

  angular.module('pixeladmin')
    .controller('MainCtrl', MainCtrl);
})();
