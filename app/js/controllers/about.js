'use strict';

ProximityApp.controller('AboutCtrl', ['$scope', '$location', function(s, $location) {
	s.isSidebarActive = function(hash){
		return $location.hash() == hash;
	};
}]);
