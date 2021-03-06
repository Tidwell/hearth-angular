'use strict';

describe('Controller: TournamentInfoCtrl', function () {

  // load the controller's module
  beforeEach(module('hearthApp'));

  var TournamentInfoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TournamentInfoCtrl = $controller('TournamentInfoCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
