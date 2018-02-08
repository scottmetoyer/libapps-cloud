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
    .service('User', function (store) {
      var service = this;
      var currentUser = null;

      service.setCurrentUser = function (user) {
        currentUser = user;
        store.set('user', user);
        return currentUser;
      };

      service.getCurrentUser = function () {
        if (!currentUser) {
          currentUser = store.get('user');
        }
        return currentUser;
      };
    })
    .service('Login', function ($http) {
      var service = this;

      service.login = function (email, password) {
        // Post credentials to an authentication method, return an $http promise
        return $http.post("http://httpbin.org/post", JSON.stringify({ 'email': email, 'password': password }));
      };

      service.logout = function () {
        return $http.post("http://httpbin.org/post", JSON.stringify({ 'q': 'hello' }));
      };
    })
    .service('authInterceptor', function ($q, $location, User) {
      var casRoot = 'https://dev.scottmetoyer.com:8443/cas-server-webapp-4.0.0';
      var service = this;

      service.request = function (config) {
        var currentUser = User.getCurrentUser();
        var accessToken = currentUser ? currentUser.accessToken : null;

        if (accessToken) {
          config.headers.authToken = accessToken;
        }

        return config;
      };
      service.responseError = function (response) {
        if (response.status == 401 || response.status == 403) {

          // Redirect to CAS
          window.location = casRoot + '?service='; // Append the application URL + requested path
        }
        return $q.reject(response);
      };
    })
    .service('cognito', function () {
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