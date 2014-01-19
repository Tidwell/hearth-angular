'use strict';

describe('Controller: FlashMsgCtrl', function () {

  // load the controller's module
  beforeEach(module('hearthApp'));

  var FlashMsgCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FlashMsgCtrl = $controller('FlashMsgCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
