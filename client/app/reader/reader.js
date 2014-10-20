'use strict';

angular.module('readerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('reader', {
        url: '/reader',
        templateUrl: 'app/reader/reader.html',
        controller: 'ReaderCtrl'
      });
  });