'use strict';

describe('Service: Chat', function () {

  // load the service's module
  beforeEach(module('HearthApp'));

  // instantiate service
  var Chat;
  beforeEach(inject(function (_Chat_) {
    Chat = _Chat_;
  }));

  it('should do something', function () {
    expect(!!Chat).toBe(true);
  });

});
