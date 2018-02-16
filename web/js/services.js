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
    .service('Auth', function($state, angularAuth0, $timeout){
      var service = this;
      var userProfile;

      service.login = function() {
        angularAuth0.authorize();
      };

      service.handleAuthentication = function(callback) {
        var self = this;
        self.callback = callback;

        angularAuth0.parseHash(function(err, authResult) {
          if (authResult && authResult.accessToken && authResult.idToken) {
            service.setSession(authResult);

            if (self.callback) {
              self.callback();
            }
          } else if (err) {
            $timeout(function(){
              service.login();
            });

            console.log(err);
          }
        });
      };

      service.setSession = function(authResult) {
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
      };

      service.logout = function() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
      };

      service.isAuthenticated = function() {
        // Check whether the current time is past the Access Token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
      };

      service.getProfile = function(cb) {
        var accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('Access Token must exist to fetch profile');
        }
        angularAuth0.client.userInfo(accessToken, function(err, profile) {
          if (profile) {
            service.setUserProfile(profile);
          }
          cb(err, profile);
        });
      };

      service.setUserProfile = function(profile) {
        userProfile = profile;
      };

      service.getCachedProfile = function() {
        return userProfile;
      };
    })
    .service('unauthorizedInterceptor', function ($q, $location, $state, Auth) {
      var service = this;

      service.responseError = function (response) {
        console.log('we got a 401 back!');
        if (response.status == 401 || response.status == 403) {
          Auth.login();
        }

        return $q.reject(response);
      };
    })
})();