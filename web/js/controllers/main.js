(function() {
  // ===============================================================================
  // Controllers / Main
  //

  function MainCtrl($rootScope, $state) {
    var main = this;
    this.companyName = 'UCR Library';
  }

  angular.module('pixeladmin')
    .controller('MainCtrl', MainCtrl);
})();
