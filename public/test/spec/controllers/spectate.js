'use strict';

describe('Controller: SpectateCtrl', function () {

  // load the controller's module
  beforeEach(module('hearthApp'));

  var SpectateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpectateCtrl = $controller('SpectateCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
