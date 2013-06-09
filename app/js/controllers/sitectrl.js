'use strict';

ProximityApp.controller('SiteCtrl', ['$scope', '$location', '$window', '$timeout', '$anchorScroll', 'GlobalService', function(s, $location, $window, $timeout, $anchorScroll, global){
  s.global = global;
  s.isHome = $location.path() == '/';
  s.headerLinks = [
    {label: 'Home', link: '/', active:true, useCarousel:true},
    {label: 'About', link: '/about', active: false, useCarousel: false},
    {label: 'Contact', link: '/contact', active: false, useCarousel: false}
  ];

  s.changeRoute = function(route, hash){
    if(route){
      devLog('change route: ' + route);

      if (_.isString(route) && route.indexOf('http') > -1) {
        $window.location.href = route
      } else {
        $location.path(route);
        s.isHome = route == '/';
        _.forEach(s.headerLinks, function(l){
          l.active = l.link == route;
        });
  //      if(angular.element('.nav-collapse').hasClass('in')) {
  //        angular.element('.btn-navbar').trigger('click');
  //      }
        s.toggleMenu(false);  

        if(hash){
          $timeout(function(){
            $location.hash(hash);
            $anchorScroll();
          }, 500);
          
        }
      }
      

      
    }
  };

  s.toggleMenu = function(force){
    if(force !== undefined){
      // force state
      s.global.menuEnabled(force);
    } else {
      // toggle state
      s.global.menuEnabled(!s.global.menuEnabled());
    }

  };

  s.carouselActive = function(){
    var activeRoute = _.find(s.headerLinks, function(l){
      return l.link == $location.path();
    });

    return activeRoute ? activeRoute.useCarousel : false;
  };
}]);
