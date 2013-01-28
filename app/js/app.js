var ProximityApp = angular.module('ProximityApp', ['ngResource', 'ngSanitize', 'ui', 'Scope.onReady'])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
  if (Proximity.prop.platform.IS_LEGACY_ANDROID || Proximity.prop.platform.IS_LEGACY_IE){
    // FULL SITE DOES NOT NEED HTML5 History API support because we don't use $routeProvider
    // CRITICAL for proper old IE and Android 2.3.3 / 2.3.4 support
    // Angular docs state setting html5Mode(true) *should* degrade gracefully if browser doesn't support html5 history
    // but it does NOT! ... must set this *explicitly* to false in order to work properly
    $locationProvider.html5Mode(false);
  } else {
    $locationProvider.html5Mode(true);
  }

  $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/products', {
        templateUrl: 'views/products.html',
        controller: 'ProductsCtrl'
      })
      .when('/blog', {
        templateUrl: 'views/blog.html',
        controller: 'BlogCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/privacy', {
        templateUrl: 'views/privacy.html',
        controller: 'PrivacyCtrl'
      })
      .when('/terms', {
        templateUrl: 'views/terms.html',
        controller: 'TermsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
