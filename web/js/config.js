(function () {
  // ===============================================================================
  // Config
  //

  function config($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    // Default url
    $urlRouterProvider.otherwise("/");
    $locationProvider.hashPrefix('!');

    $ocLazyLoadProvider.config({
      debug: false
    });

    // Routes
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/auth/login.html'
      })
      .state('pages', {
        abstract: true,
        url: '/',
        templateUrl: 'views/common/layout.html',
      })
      .state('pages.in-flight', {
        url: '',
        templateUrl: 'views/in-flight.html',
        data: { pageTitle: 'In-flight projects' },
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                serie: true,
                name: 'ng-sortable',
                files: [
                  'js/libs/jquery-sortable.js'
                ]
              },
            ]);
          },
        }
      })
      .state('pages.backlog', {
        url: 'backlog',
        templateUrl: 'views/backlog.html',
        data: { pageTitle: 'Backlog projects' },
        resolve: {
          // Load plugins here
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                serie: true,
                name: 'ng-sortable',
                files: [
                  'js/libs/jquery-sortable.js'
                ]
              },
            ]);
          },
        },
      })
      .state('pages.create-project', {
        url: 'create-project',
        templateUrl: 'views/create-project.html',
        data: { pageTitle: 'Create a project' },
        resolve: {
          // Load plugins here
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('pages.view-project', {
        url: 'view-project/:key',
        templateUrl: 'views/view-project.html',
        data: { pageTitle: 'Project dashboard' },
        resolve: {
          // Load plugins here
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('pages.archive', {
        url: 'archive',
        templateUrl: 'views/archive.html',
        data: { pageTitle: 'Archived projects' },
        resolve: {
          // Load plugins here
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('pages.edit-project', {
        url: 'edit-project/:key',
        templateUrl: 'views/edit-project.html',
        data: { pageTitle: 'Edit project' },
        resolve: {
          // Load plugins here
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('pages.recurring-tasks', {
        url: 'recurring-tasks',
        templateUrl: 'views/recurring-tasks.html',
        data: { pageTitle: 'Recurring tasks' },
        resolve: {
          // Load plugins here
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('pages.create-task', {
        url: 'create-task',
        templateUrl: 'views/create-recurring-task.html',
        data: { pageTitle: 'Create a recurring task' },
        resolve: {
          // Load plugins here
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('pages.edit-task', {
        url: 'edit-task/:id',
        templateUrl: 'views/edit-recurring-task.html',
        data: { pageTitle: 'Edit task' },
        resolve: {
          // Load plugins here
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('pages.request', {
        url: 'request/create',
        templateUrl: 'views/requests/create.html',
        data: { pageTitle: 'New request' },
        resolve: {
          // Load plugins here
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('pages.create-annual-equipment-request', {
        url: 'request/create/annual-equipment',
        templateUrl: 'views/requests/annual-equipment/start.html',
        data: { pageTitle: 'New Annual Equipment purchase request' },
        resolve: {
          // Load plugins here
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                name: 'px-wizard',
                files: [
                  'js/pixeladmin/plugins/px-wizard.js'
                ]
              },
            ]);
          },
        },
      })
      .state('pages.annual-equipment-request-submitted', {
        url: 'request/create/annual-equipment/success',
        templateUrl: 'views/requests/annual-equipment/success.html',
        data: { pageTitle: 'Annual Equipment purchase request submitted' },
        resolve: {
          // Load plugins here
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      });

      $httpProvider.interceptors.push('authInterceptor');
  };

  function run($rootScope, $state, $http) {
    $rootScope.$state = $state;

    $rootScope.$on('$stateChangeStart', function () {
      // Restart page loader
      if (window.Pace && typeof window.Pace.restart === 'function') {
        window.Pace.restart();
      }
    });
  }

  angular.module('pixeladmin')
    .config(['$stateProvider', '$locationProvider', '$httpProvider', '$urlRouterProvider', '$ocLazyLoadProvider', config])
    .run(['$rootScope', '$state', '$http', run]);
})();
