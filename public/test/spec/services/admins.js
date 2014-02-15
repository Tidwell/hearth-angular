'use strict';

describe('Service: Admins', function () {

  // load the service's module
  beforeEach(module('HearthApp'));

  // instantiate service
  var Admins;
  beforeEach(inject(function (_Admins_) {
    Admins = _Admins_;
  }));

  it('should do something', function () {
    expect(!!Admins).toBe(true);
  });

});
