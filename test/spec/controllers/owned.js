'use strict';

describe('Controller: OwnedCtrl', function () {

  // load the controller's module
  beforeEach(module('hearthApp'));

  var OwnedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OwnedCtrl = $controller('OwnedCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
