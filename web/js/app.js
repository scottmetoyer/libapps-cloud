(function () {
  // ===============================================================================
  // Application
  //

  angular.module('pixeladmin', [
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
  ]);

  // Other modules will be loaded dynamically using oc.lazyLoad plugin (see the config.js file)

})();
