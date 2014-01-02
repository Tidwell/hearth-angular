'use strict';

describe('Service: Tournaments', function () {

  // load the service's module
  beforeEach(module('HearthApp'));

  // instantiate service
  var Tournaments;
  beforeEach(inject(function (_Tournaments_) {
    Tournaments = _Tournaments_;
  }));

  it('should do something', function () {
    expect(!!Tournaments).toBe(true);
  });

});
