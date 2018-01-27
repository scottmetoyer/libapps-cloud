(function() {
  // ===============================================================================
  // Controllers / Main
  //

  function MainCtrl($window) {
    this.companyName = 'UCR Library';
    this.username = 'User Name';

    this.logout = function() {
      $window.location.href = '/login.html';
    }
  }

  angular.module('pixeladmin')
    .controller('MainCtrl', MainCtrl);

})();
