(function () {

  angular.module('pixeladmin')
    .service('bl', function () {
      this.calculateStatus = function (project) {
        var status = { description: 'On track', class: 'text-success' };

        if (!project.hasProjectPlan) {
          status = { description: 'At risk', class: 'text-danger' };
        } else {
          if (!project.hasWiki || !project.hasJiraProject) {
            status = { description: 'Needs attention', class: 'text-warning' };
          }
        }

        return status;
      }
    })
    .service('authInterceptor', function ($q, $location) {
      var service = this;

      service.responseError = function (response) {
        if (response.status == 401) {
          $location.path('/login');
        }
        return $q.reject(response);
      };
    })
    .service('cognito', function() {
      // AWS configuration values
      AWS.config.region = 'us-west-2';
      /*
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
      });
      */

      AWSCognito.config.region = 'us-west-2';
      /*
      AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-west-2:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
      });
      */

      this.getUserPool = function () {
        var poolData = {
          UserPoolId: 'us-west-2_SQkWjtXWr',
          ClientId: 't74trm5th4tr2qcktfkgt9oq8'
        };
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        return userPool;
      };

      this.getUser = function (userPool, username) {
        var userData = {
          Username: username,
          Pool: userPool
        };
        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        return cognitoUser;
      };

      this.getAuthenticationDetails = function (username, password) {
        var authenticationData = {
          Username: username,
          Password: password
        };
        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        return authenticationDetails;
      };

      this.getUserAttributes = function () {
        var attributes = [];
        for (var i = 0; i < arguments.length; i++) {
          var attr = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(arguments[i]);
          attributes.push(attr);
        }
        return attributes;
      };
    })
})();