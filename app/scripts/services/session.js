'use strict';

angular.module('mentelinApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
