'use strict';

describe('Service: FlashMsg', function () {

  // load the service's module
  beforeEach(module('HearthApp'));

  // instantiate service
  var FlashMsg;
  beforeEach(inject(function (_FlashMsg_) {
    FlashMsg = _FlashMsg_;
  }));

  it('should do something', function () {
    expect(!!FlashMsg).toBe(true);
  });

});
