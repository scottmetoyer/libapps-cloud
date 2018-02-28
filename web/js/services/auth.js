(function () {

  angular.module('pixeladmin')
    .service('Auth', function ($state, angularAuth0, jwtHelper, $timeout, $rootScope) {
      var service = this;

      service.login = function () {
        angularAuth0.authorize();
      };

      service.handleAuthentication = function () {
        var self = this;

        // Check for an auth token in the query string first
        angularAuth0.parseHash(function (err, authResult) {
          if (authResult && authResult.accessToken && authResult.idToken) {
            service.setSession(authResult);
            $rootScope.$broadcast('user-login', service.getUser());
            $state.go('dashboard.view');
          } else if (err) {
            // Send them to the Auth0 login page if there are exceptions
            console.log(err);

            $timeout(function () {
              service.login();
            });
          } else {
            // Check for an auth token in session because there wasn't any in the query string
            var accessToken = localStorage.getItem('access_token');

            if (accessToken && accessToken != '') {
              return;
            } else {
              service.login();
            }
          }
        });
      };

      service.setSession = function (authResult) {
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
      };

      service.logout = function () {
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
      };

      service.isAuthenticated = function () {
        // Check whether the current time is past the Access Token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
      };

      service.getProfile = function () {
        var accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('Access Token must exist to fetch profile');
        }
        angularAuth0.client.userInfo(accessToken, function (err, profile) {
          if (err) {
            console.log(err);
          }
          if (profile) {
            service.setUserProfile(profile);
          }
        });
      };

      service.setUserProfile = function (profile) {
        userProfile = profile;
      };

      service.getCachedProfile = function () {
        return userProfile;
      };

      service.getUser = function () {
        if (localStorage.getItem('id_token')) {
          return jwtHelper.decodeToken(localStorage.getItem('id_token'));
        }
      }

      service.resetPassword = function () {
        angularAuth0.changePassword({
          connection: 'Username-Password-Authentication',
          email: service.getUser().name
        }, function (err, resp) {
          if (err) {
            console.log(err);
          } else {
            console.log(resp);
          }
        })
      }
    })
    .service('unauthorizedInterceptor', function ($q, $location, $state, Auth) {
      var service = this;

      service.responseError = function (response) {
        if (response.status == 401 || response.status == 403) {
          Auth.login();
        }

        return $q.reject(response);
      };
    })
})();