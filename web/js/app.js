(function () {
  // ===============================================================================
  // Application
  //

  // Import environment variables
  var env = {};

  if (window) {
    Object.assign(env, window.__env);
  }

  angular.module('pixeladmin', [
    'auth0.auth0',
    'angular-jwt',
    'ui.router',
    'oc.lazyLoad',
    'ui.bootstrap',
    'ngMessages',

    // Common modules
    'perfect_scrollbar',
    'px-navbar',
    'px-nav',
    'px-footer',
    'angular-storage'
  ])
    .constant('__env', env);

  // Other modules will be loaded dynamically using oc.lazyLoad plugin (see the config.js file)

})();
