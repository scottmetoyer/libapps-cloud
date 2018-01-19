(function() {
  // ===============================================================================
  // Custom directives
  //

  function pageTitleDirective($rootScope) {
    return {
      link: function(_scope_, $element) {
        function listener(event, toState, toParams, fromState, fromParams) {
          var title =
            (toState.data && toState.data.pageTitle ? (toState.data.pageTitle + ' - ') : '') +
            'UCR Library Project Atlas';

          $element.text(title);
        }

        $rootScope.$on('$stateChangeStart', listener);
      }
    };
  }

  function disallowSpacesDirective() {
    return {
      restrict: 'A',

      link: function($scope, $element) {
        $element.bind('input', function() {
          $(this).val($(this).val().replace(/ /g, ''));
        });
      }
    };
  }

  angular.module('pixeladmin')
    .directive('pageTitle', [ '$rootScope', pageTitleDirective ])
    .directive('disallowSpaces', [ '$rootScope', disallowSpacesDirective]);

})();