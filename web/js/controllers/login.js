(function () {
  // ===============================================================================
  // Controllers / Login
  //

  function LoginCtrl($state, $timeout, Auth) {
    Auth.handleAuthentication(function() {
      $state.go('pages.in-flight');
    });
  }

  angular.module('pixeladmin')
    .controller('LoginCtrl', LoginCtrl);
})();