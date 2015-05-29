'use strict';

describe('Service: Twitch', function () {

  // load the service's module
  beforeEach(module('hearthApp'));

  // instantiate service
  var Twitch;
  beforeEach(inject(function (_Twitch_) {
    Twitch = _Twitch_;
  }));

  it('should do something', function () {
    expect(!!Twitch).toBe(true);
  });

});
