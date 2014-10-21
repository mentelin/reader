'use strict';

describe('Controller: ReaderCtrl', function () {

  // load the controller's module
  beforeEach(module('readerApp'));

  var ReaderCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReaderCtrl = $controller('ReaderCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    // expect(1).toEqual(1);
  });
});
