'use strict';

describe('Controller: LeaderboardsCtrl', function () {

  // load the controller's module
  beforeEach(module('hearthApp'));

  var LeaderboardsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LeaderboardsCtrl = $controller('LeaderboardsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
