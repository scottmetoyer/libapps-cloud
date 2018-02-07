(function() {
  // ===============================================================================
  // Controllers / Login
  //

  function LoginCtrl($http, $stateParams, $location, $scope, cognito) {
    var self = this;
    var email = '';
    var password = '';

    // Variables for holding new password properties
    var newPassword = '';
    var retypeNewPassword = '';

    self.login = function(isValid) {
      // Test set password modal
      if (isValid) {
        var userPool = cognito.getUserPool();
        var user = cognito.getUser(userPool, self.email);
        var authenticationDetails = cognito.getAuthenticationDetails(self.email, self.password);

        user.authenticateUser(authenticationDetails, {
          onSuccess: function (result) {
            console.log(result);
            var accessToken = result.getAccessToken().getJwtToken();
            // $scope.accessToken = accessToken;

            var currentUser = userPool.getCurrentUser();
            console.log(currentUser);
            // $location.path('/contents');
            $scope.$apply();
          },
          onFailure: function (err) {
            console.log(err);
            $scope.$apply();
          },
          newPasswordRequired: function(userAttributes, requiredAttributes) {
            delete userAttributes.email_verified;
            var newPasswordCallback = this;

            angular.element('#setPasswordModal').modal('show');
            self.submitNewPassword = function() {
              user.completeNewPasswordChallenge(self.newPassword, self.userAttributes, newPasswordCallback);
              angular.element('#setPasswordModal').modal('hide');
            }
          },
          passwordResetRequired: function() {

          }
        });
      }
    }
  }

  angular.module('pixeladmin')
    .controller('LoginCtrl', LoginCtrl);
})();