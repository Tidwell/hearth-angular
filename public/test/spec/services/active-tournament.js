'use strict';

describe('Service: ActiveTournament', function () {

  // load the service's module
  beforeEach(module('HearthApp'));

  // instantiate service
  var ActiveTournament;
  beforeEach(inject(function (_ActiveTournament_) {
    ActiveTournament = _ActiveTournament_;
  }));

  it('should do something', function () {
    expect(!!ActiveTournament).toBe(true);
  });

});
