'use strict';

angular.module('readerApp')
  .controller('MainCtrl', function ($scope) {
    $scope.readerWidth = 0;
    $scope.width = 0;
    $scope.activePage = 0;

    $scope.pagePrev = function () {
      if ($scope.activePage !== 0) {
        var left = $scope.activePage + $scope.readerWidth;

        $scope.activePage = left;

        $('#readerContent').css({
          marginLeft: left
        });
      }
    };

    $scope.pageNext = function () {
      var left = $scope.activePage - $scope.readerWidth;

      if (-left < $scope.width) {
        $scope.activePage = left;

        $('#readerContent').css({
          marginLeft: left
        });
      }
    };

    $scope.bookLayout = function () {
      var height = $(window).outerHeight(),
          $reader = $('#readerContent'),
          $readerWrapper = $('#readerContentWrapper');

      $readerWrapper.css({
        top: height * 0.11
      });

      var windowHeight = $(window).outerHeight() - $(window).outerHeight() * 0.11 - $(window).outerHeight() * 0.22,
          readerHeight = $reader.height(),
          columnCount = Math.ceil(readerHeight / windowHeight),
          readerWidth = $readerWrapper.outerWidth(),
          width = readerWidth * columnCount;

      $scope.readerWidth = readerWidth;
      $scope.width = width;

      $reader.attr('style',
        'width: ' + width + 'px;' +
        '-webkit-column-count: ' + columnCount + ';' +
        '-moz-column-count: ' + columnCount + ';' +
        'column-count: ' + columnCount + ';' +
        'margin-left: ' + $scope.activePage + ';'
      );
    };

    $(function () {
      $scope.bookLayout();
    });

    $(window).resize(function () {
      $scope.activePage = 0;
      $('#readerContent').removeAttr('style');

      $scope.bookLayout();
    });
  });
