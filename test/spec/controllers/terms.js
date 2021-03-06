'use strict';

describe('Controller: TermsCtrl', function() {

  // load the controller's module
  beforeEach(module('ProximityApp'));

  var TermsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    TermsCtrl = $controller('TermsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
