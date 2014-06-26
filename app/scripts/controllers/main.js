'use strict';

angular.module('mentelinApp')
  .controller('MainCtrl', function ($scope, $http, $upload) {
    $http.get('/api/books')
      .success(function (data) {
        $scope.books = data;
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });

    $scope.createBook = function() {
      $http.post('/api/books', $scope.book)
        .success (function (data) {
          $scope.book = {};
          $scope.books = data;
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });
    };

    $scope.updateBook = function(id) {
      var books = angular.fromJson($scope.books),
          book;

      for (var i = 0; books.length > i; i++) {
        if (books[i]._id === id) {
          book = books[i];
        }
      }

      $http.put('/api/books/' + id, book)
        .success(function (data) {
          $scope.book = {};
          $scope.books = data;
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });
    };

    $scope.onFileSelect = function($files) {
      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];

        $scope.upload = $upload.upload({
            url: '/api/books/upload',
            file: file,
          })
          .progress(function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
          })
          .success(function (data, status, headers, config) {
            // console.log(data);
          });
      }
    };

    $scope.deleteBook = function(id) {
      $http.delete('/api/books/' + id)
        .success(function (data) {
          $scope.books = data;
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });
    };
  });
