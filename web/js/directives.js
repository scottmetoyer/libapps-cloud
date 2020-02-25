(function () {
  // ===============================================================================
  // Custom directives
  //

  function pageTitleDirective($rootScope) {
    return {
      link: function (_scope_, $element) {
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

      link: function ($scope, $element) {
        $element.bind('input', function () {
          $(this).val($(this).val().replace(/ /g, ''));
        });
      }
    };
  }

  function compareToDirective() {
    return {
      require: "ngModel",
      scope: {
        compareTolValue: "=compareTo"
      },
      link: function (scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function (modelValue) {
          return modelValue == scope.compareTolValue;
        };

        scope.$watch("compareTolValue", function () {
          ngModel.$validate();
        });
      }
    };
  }

  function complexDirective() {
  }

  function owlCarouselItemDirective() {
    return {
      restrict  : "A",
      transclude: false,
      link      : function ($scope, element, attributes) {
        if ( $scope.$last )
          $scope.initCarousel();
      }
    };
  }
  
  angular.module('pixeladmin')
    .directive('pageTitle', ['$rootScope', pageTitleDirective])
    .directive('disallowSpaces', ['$rootScope', disallowSpacesDirective])
    .directive('compareTo', ['$rootScope', compareToDirective])
    .directive('owlCarouselItem', ['$rootScope', owlCarouselItemDirective])
})();