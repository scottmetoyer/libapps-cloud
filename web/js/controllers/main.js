(function () {
  // ===============================================================================
  // Controllers / Main
  //

  function MainCtrl($scope, $state, Auth) {
    var main = this;
    main.companyName = 'UCR Library';
    main.user = Auth.getUser();
    main.showAlert = false;

    main.logout = function () {
      Auth.logout();

      // Redirect to login page
      Auth.login();
    }

    main.resetPassword = function () {
      // Auth.resetPassword();
      $.growl.notice(
        {
          title: "Password reset request",
          message: "An email has been sent with further instructions. Please check your inbox.",
          delayOnHover: false,
          duration: 5000
        });
    }

    $scope.$on('user-login', function (event, args) {
      main.user = args;
    });

  }

  angular.module('pixeladmin')
    .controller('MainCtrl', MainCtrl);
})();
