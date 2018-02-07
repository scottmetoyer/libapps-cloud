(function() {
  // ===============================================================================
  // Controllers / Main
  //

  function MainCtrl($rootScope, $state, User, Login) {
    var main = this;
    this.companyName = 'UCR Library';

    this.logout = function() {
      Login.logout()
      .then(function(response) {
          main.currentUser = User.setCurrentUser(null);
          $state.go('login');
      }, function(error) {
          console.log(error);
      });
    }

    $rootScope.$on('authorized', function() {
        main.currentUser = User.getCurrentUser();
    });

    $rootScope.$on('unauthorized', function() {
        main.currentUser = User.setCurrentUser(null);
        $state.go('login');
    });

    main.currentUser = User.getCurrentUser();
  }

  angular.module('pixeladmin')
    .controller('MainCtrl', MainCtrl);
})();
