'use strict';

ProximityApp.controller('SiteCtrl', ['$scope', '$location', function(s, $location){
  s.isHome = $location.path() == '/';
  s.headerLinks = [
    {label: 'Home', link: '/', active:true, useCarousel:true},
    {label: 'Products', link: '/products', active: false, useCarousel: false},
    {label: 'Blog', link: '/blog', active: false, useCarousel: false},
    {label: 'About', link: '/about', active: false, useCarousel: false},
    {label: 'Contact', link: '/contact', active: false, useCarousel: false}
  ];

  s.changeRoute = function(route){
    if(route){
      console.log('change route: ' + route);

      $location.path(route);
      s.isHome = route == '/';
      _.forEach(s.headerLinks, function(l){
        l.active = l.link == route;
      });
    }
  }

  s.carouselActive = function(){
    var activeRoute = _.find(s.headerLinks, function(l){
      return l.link == $location.path();
    });

    return activeRoute ? activeRoute.useCarousel : false;
  };
}]);
