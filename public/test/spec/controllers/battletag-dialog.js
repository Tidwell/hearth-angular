'use strict';

describe('Controller: BattletagDialogCtrl', function () {

  // load the controller's module
  beforeEach(module('hearthApp'));

  var BattletagDialogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BattletagDialogCtrl = $controller('BattletagDialogCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
