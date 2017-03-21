// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngSanitize'])

  .run(function ($ionicPlatform, $rootScope, $templateCache) {
     // var stateChangeSuccess = $rootScope.$on('$stateChangeSuccess', function ($rootScope) {  
     //   $templateCache.removeAll();    
     // });  

       
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    // $locationProvider.html5Mode(true).hashPrefix('!');

    $stateProvider
      .state('minite', {
        url: '/minite',
        cache: false
      })
      .state('daily', {
        url: '/daily',
        cache: false
      })
      .state('app', {
        url: '/app',
        abstract: true,
        cache: false,
        templateUrl: 'templates/menu.html?t=' + Math.floor(Date.now() / 1000),
        controller: 'AppCtrl'
      })
      .state('app.short', {
        url: '/short',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/short.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'ShortCtrl'
          }
        }
      })
      .state('app.inspect', {
        url: '/inspect',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/inspect.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'InspectCtrl'
          }
        }
      })
      .state('app.action', {
        url: '/action',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/action.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'ActionCtrl'
          }
        }
      })
      .state('app.cal', {
        url: '/cal',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/cal.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'CalCtrl'
          }
        }
      })
      .state('app.holder', {
        url: '/holder',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/holder.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'HolderCtrl'
          }
        }
      })
      .state('app.attend', {
        url: '/attend',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/attend.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'AttendCtrl'
          }
        }
      })
      .state('app.waveHolder', {
        url: '/waveHolder',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/chartHolder.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'WaveHolderCtrl'
          }
        }
      })
      .state('app.waveAttend', {
        url: '/waveAttend',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/chartAttend.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'WaveAttendCtrl'
          }
        }
      })
      .state('app.popular', {
        url: '/popular',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/popular.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'PopularCtrl'
          }
        }
      })
      .state('app.tab', {
        url: '/tab',
        abstract: true,
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/transTab.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'TabCtrl'
          }
        }
      })
      .state('app.tab.rate', {
        url: '/rate',
        cache: false,
        views: {
          'rate': {
            templateUrl: 'templates/rate.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'RateCtrl'
          }
        }
      }).state('app.tab.trans', {
        url: '/trans',
        cache: false,
        views: {
          'trans': {
            templateUrl: 'templates/trans.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'TransCtrl'
          }
        }
      })
      .state('app.tab.bktrans', {
        url: '/bktrans',
        cache: false,
        views: {
          'bktrans': {
            templateUrl: 'templates/bktrans.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'BktransCtrl'
          }
        }
      })
      .state('app.tab.ctrans', {
        url: '/ctrans',
        cache: false,
        views: {
          'ctrans': {
            templateUrl: 'templates/ctrans.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'CtransCtrl'
          }
        }
      })
      .state('app.my', {
        url: '/my',
        abstract: true,
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/myTab.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'MyCtrl'
          }
        }
      })
      .state('app.my.holder', {
        url: '/holder',
        cache: false,
        views: {
          'holder': {
            templateUrl: 'templates/holder.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'HolderCtrl'
          }
        }
      })
      .state('app.my.attend', {
        url: '/attend',
        cache: false,
        views: {
          'attend': {
            templateUrl: 'templates/attend.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'AttendCtrl'
          }
        }
      })
      .state('app.my.waveHolder', {
        url: '/waveHolder',
        cache: false,
        views: {
          'waveHolder': {
            templateUrl: 'templates/chartHolder.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'WaveHolderCtrl'
          }
        }
      })
      .state('app.my.waveAttend', {
        url: '/waveAttend',
        cache: false,
        views: {
          'waveAttend': {
            templateUrl: 'templates/chartAttend.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'WaveAttendCtrl'
          }
        }
      })
      .state('app.other', {
        url: '/other',
        abstract: true,
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/otherTab.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'OtherCtrl'
          }
        }
      })
      .state('app.other.daily', {
        url: '/daily',
        cache: false,
        views: {
          'daily': {
            templateUrl: 'templates/daily.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'DailyCtrl'
          }
        }
      })
      .state('app.other.signal', {
        url: '/signal',
        cache: false,
        views: {
          'signal': {
            templateUrl: 'templates/signal.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'SignalCtrl'
          }
        }
      })
      .state('app.other.wave', {
        url: '/wave',
        cache: false,
        views: {
          'wave': {
            templateUrl: 'templates/wave.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'WaveCtrl'
          }
        }
      })
      .state('app.other.ascend', {
        url: '/ascend',
        cache: false,
        views: {
          'ascend': {
            templateUrl: 'templates/ascend.html?t=' + Math.floor(Date.now() / 1000),
            controller: 'AscendCtrl'
          }
        }
      });
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/action');
  });