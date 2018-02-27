(function () {
  // ===============================================================================
  // Config
  //

  function config(
    $stateProvider,
    $locationProvider,
    $httpProvider,
    $urlRouterProvider,
    $ocLazyLoadProvider,
    angularAuth0Provider,
    jwtOptionsProvider,
    __env) {

    // Default url
    $urlRouterProvider.otherwise("/");
    $locationProvider.hashPrefix('');

    $ocLazyLoadProvider.config({
      debug: false
    });

    // Routes
    $stateProvider
      // Local authentication manager routes
      .state('dashboard', {
        abstract: true,
        url: '',
        templateUrl: 'views/common/layout.html',
      })
      .state('dashboard.view', {
        url: '/',
        templateUrl: 'views/dashboard.html'
      })

      // Project Atlas routes
      .state('projects', {
        abstract: true,
        url: '/projects',
        templateUrl: 'views/common/layout.html',
      })
      .state('projects.in-flight', {
        url: '/in-flight',
        templateUrl: 'views/projects/in-flight-list.html',
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
      .state('projects.backlog', {
        url: '/backlog',
        templateUrl: 'views/projects/backlog-list.html',
        data: { pageTitle: 'Backlog projects' },
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
        },
      })
      .state('projects.create', {
        url: '/create',
        templateUrl: 'views/projects/create.html',
        data: { pageTitle: 'Create a project' },
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('projects.view', {
        url: '/view/:id',
        templateUrl: 'views/projects/view.html',
        data: { pageTitle: 'Project dashboard' },
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('projects.archive', {
        url: '/archive',
        templateUrl: 'views/projects/archive-list.html',
        data: { pageTitle: 'Archived projects' },
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('projects.edit', {
        url: '/edit/:id',
        templateUrl: 'views/projects/edit.html',
        data: { pageTitle: 'Edit project' },
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })

      .state('recurring-tasks', {
        abstract: true,
        url: '',
        templateUrl: 'views/common/layout.html',
      })
      // Recurring Task routes
      .state('recurring-tasks.list', {
        url: '/recurring-tasks',
        templateUrl: 'views/recurring-tasks/list.html',
        data: { pageTitle: 'Recurring tasks' },
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('recurring-tasks.create', {
        url: '/create',
        templateUrl: 'views/recurring-tasks/create.html',
        data: { pageTitle: 'Create a recurring task' },
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('recurring-tasks.edit', {
        url: '/edit/:id',
        templateUrl: 'views/recurring-tasks/edit.html',
        data: { pageTitle: 'Edit task' },
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })

      // Request routes
      .state('requests', {
        abstract: true,
        url: '/requests',
        templateUrl: 'views/common/layout.html',
      })
      .state('requests.create', {
        url: '/create',
        templateUrl: 'views/requests/create.html'
      })
      .state('requests.view', {
        url: '/view/:id',
        templateUrl: 'views/requests/view.html',
        data: { pageTitle: 'View request' },
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('requests.edit', {
        url: '/edit/:id',
        templateUrl: 'views/requests/edit.html',
        data: { pageTitle: 'Edit request' },
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      })
      .state('requests.annual-equipment', {
        url: '/list',
        templateUrl: 'views/requests/list.html',
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                name: 'ui.sortable',
                files: [
                  'js/libs/sortable.min.js'
                ]
              },
            ]);
          },
        }
      })
      .state('requests.create-annual-equipment-request', {
        url: '/annual-equipment/create',
        templateUrl: 'views/requests/annual-equipment/start.html',
        data: { pageTitle: 'New Annual Equipment purchase request' },
        resolve: {
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
      .state('requests.annual-equipment-request-submitted', {
        url: '/annual-equipment/success',
        templateUrl: 'views/requests/annual-equipment/success.html',
        data: { pageTitle: 'Annual Equipment purchase request submitted' },
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([]);
          },
        },
      });

    // Configure Auth0
    angularAuth0Provider.init({
      clientID: 'Ykc0nxkt4nE3up5Za0Zekb2TK0mR7bkO',
      domain: 'scott-metoyer.auth0.com',
      responseType: 'token id_token',
      audience: 'https://ucr-library-custom-authorizer.ucr.edu',
      redirectUri: __env.applicationUrl,
      scope: 'openid profile access'
    });

    // Configure JWT tokens
    jwtOptionsProvider.config({
      tokenGetter: function () {
        return localStorage.getItem('access_token');
      },
      whiteListedDomains: ['localhost', __env.whitelistUrl]
    });

    $httpProvider.interceptors.push('jwtInterceptor');
    $httpProvider.interceptors.push('unauthorizedInterceptor');
  };

  function run($rootScope, $state, $http, Auth, $transitions) {
    Auth.handleAuthentication();
    $rootScope.$state = $state;
  }

  angular.module('pixeladmin')
    .config([
      '$stateProvider',
      '$locationProvider',
      '$httpProvider',
      '$urlRouterProvider',
      '$ocLazyLoadProvider',
      'angularAuth0Provider',
      'jwtOptionsProvider',
      '__env', config])
    .run(['$rootScope', '$state', '$http', 'Auth', '$transitions', run]);
})();
