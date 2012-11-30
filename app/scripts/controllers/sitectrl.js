'use strict';

ProximityApp.controller('SiteCtrl', ['$scope', '$location', function(s, $location){
  s.headerLinks = [
    {label: 'Products', link: '/products'},
    {label: 'Blog', link: '/blog'},
    {label: 'About', link: '/about'},
    {label: 'Contact', link: '/contact'}
  ];

  s.changeRoute = function(route){
    if(route){
      console.log('change route: ' + route);
      $location.path(route);
    }
  }
}]);
