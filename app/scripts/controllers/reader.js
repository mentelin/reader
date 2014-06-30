'use strict';

angular.module('mentelinApp')
  .controller('ReaderCtrl', function ($scope, $http) {
    var Book = ePub($scope.url);

    Book.renderTo("readerContent");
  });
