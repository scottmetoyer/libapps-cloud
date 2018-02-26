(function() {
  // ===============================================================================
  // Controllers / Main
  //

  function MainCtrl($scope, $state, Auth) {
    var main = this;
    main.companyName = 'UCR Library';
    main.user = Auth.getUser();

    main.logout = function() {
      Auth.logout();

      // Redirect to login page
      Auth.login();
    }

    $scope.$on('user-login', function(event, args){
      main.user = args;
    });
  }

  angular.module('pixeladmin')
    .controller('MainCtrl', MainCtrl);
})();
