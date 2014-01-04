'use strict';

describe('Controller: DropModalCtrl', function () {

  // load the controller's module
  beforeEach(module('hearthApp'));

  var DropModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DropModalCtrl = $controller('DropModalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
