'use strict';

describe('Controller: TournamentEndModalCtrl', function () {

  // load the controller's module
  beforeEach(module('hearthApp'));

  var TournamentEndModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TournamentEndModalCtrl = $controller('TournamentEndModalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
