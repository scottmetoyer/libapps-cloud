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
    var verificationCode = '';

    self.login = function(isValid) {
      // Test set password modal
      if (isValid) {
        var userPool = cognito.getUserPool();
        var user = cognito.getUser(userPool, self.email);
        var authenticationDetails = cognito.getAuthenticationDetails(self.email, self.password);

        user.authenticateUser(authenticationDetails, {
          onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
            // $scope.accessToken = accessToken;

            var currentUser = userPool.getCurrentUser();

            // $location.path('/contents');
            $scope.$apply();
          },
          onFailure: function (err) {
            console.log(err.code);
            var newPasswordCallback = this;

            // Password reset required
            if (err.code == 'PasswordResetRequiredException') {
              angular.element('#resetPasswordModal').modal('show');

              self.resetPassword = function() {
                user.confirmPassword(self.verificationCode, self.newPassword, newPasswordCallback);
                angular.element('#setPasswordModal').modal('hide');
              }
            }

            // User not found
            if (err.code == 'UserNotFoundException') {
            }

            // Password does not meet requirements

            // Verification code is incorrect
            if (err.code == 'CodeMismatchException') {
              $scope.resetPasswordForm.verificationCode.$setValidity('code',  false);
            }

            if (err.code == 'InvalidPasswordException') {
              $scope.resetPasswordForm.password.$setValidity('complexity',  false);
            }
            // MinRangeError ?

            $scope.$apply();
          },
          newPasswordRequired: function(userAttributes, requiredAttributes) {
            delete userAttributes.email_verified;
            var newPasswordCallback = this;

            angular.element('#setPasswordModal').modal('show');
            self.submitNewPassword = function() {
              user.completeNewPasswordChallenge(self.newPassword, userAttributes, newPasswordCallback);
              angular.element('#setPasswordModal').modal('hide');
            }
          }
        });
      }
    }
  }

  angular.module('pixeladmin')
    .controller('LoginCtrl', LoginCtrl);
})();