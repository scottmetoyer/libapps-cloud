(function() {
  // ===============================================================================
  // Controllers / Login
  //

  function LoginCtrl($state, $rootScope, User, Login) {
    var self = this;
    var email = '';
    var password = '';
    var badCredentials = false;

    self.login = function(isValid) {
      if (isValid) {
        Login.login(email, password).then(function(response) {
          User.setCurrentUser(
            {
              accessToken: 'allow',
              name: 'Scott Metoyer'
            }
          );
          $rootScope.$broadcast('authorized');
          $state.go('pages.in-flight');
        });
      }
    }
  }

  angular.module('pixeladmin')
    .controller('LoginCtrl', LoginCtrl);
})();