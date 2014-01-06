'use strict';

describe('Controller: JoinModalCtrl', function () {

  // load the controller's module
  beforeEach(module('hearthApp'));

  var JoinModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JoinModalCtrl = $controller('JoinModalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
