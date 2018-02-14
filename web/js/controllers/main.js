(function() {
  // ===============================================================================
  // Controllers / Main
  //

  function MainCtrl($rootScope, $state, User) {
    var main = this;
    this.companyName = 'UCR Library';
    main.currentUser = User.getCurrentUser();
  }

  angular.module('pixeladmin')
    .controller('MainCtrl', MainCtrl);
})();
