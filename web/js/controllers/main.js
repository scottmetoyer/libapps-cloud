(function() {
  // ===============================================================================
  // Controllers / Main
  //

  function MainCtrl() {
    this.companyName = 'UCR Library';
    this.username = 'User Name';
  }

  angular.module('pixeladmin')
    .controller('MainCtrl', MainCtrl);

})();
