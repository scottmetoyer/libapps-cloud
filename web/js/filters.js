(function () {

  angular.module('pixeladmin')
    .filter('humandate', function () {
      return function (input) {
        return moment(parseInt(input)).fromNow();
      }
    })

})();