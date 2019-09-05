(function () {

  angular.module('pixeladmin')
    .service('bl', function () {
      this.getStatusClass = function (status) {
        var statusClass = 'text-danger';

        switch (status) {
          case 'On track':
            statusClass = 'text-success';
            break;

          case 'Needs attention':
            statusClass = 'text-warning';
            break;

          case 'At risk':
            statusClass = 'text-danger';
            break;

          default:
            statusClass = 'text-danger';
            break;
        }

        return statusClass;
      }

      this.getRequestTypes = function () {
        var types = [
          "Annual Equipment Request",
          "Student Tech Fee Request"
        ];

        return types;
      }
    })
})();