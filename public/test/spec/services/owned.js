'use strict';

describe('Service: Owned', function () {

  // load the service's module
  beforeEach(module('HearthApp'));

  // instantiate service
  var Owned;
  beforeEach(inject(function (_Owned_) {
    Owned = _Owned_;
  }));

  it('should do something', function () {
    expect(!!Owned).toBe(true);
  });

});
