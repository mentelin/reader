'use strict';

angular.module('readerApp')
  .controller('MainCtrl', function ($scope) {
    $scope.readerWrapperWidth = 0;
    $scope.readerWidth = 0;
    $scope.activePage = 0;
    $scope.pages = 1;
    $scope.currentPage = 1;

    $scope.pagePrev = function () {
      var left = $scope.activePage + $scope.readerWrapperWidth;

      if (left <= 0) {
        $scope.activePage = left;

        $('#reader').css({
          marginLeft: left
        });

        $scope.currentPage -= 1;
      }
    };

    $scope.pageNext = function () {
      var left = $scope.activePage - $scope.readerWrapperWidth;

      if (-left < $scope.readerWidth) {
        $scope.activePage = left;

        $('#reader').css({
          marginLeft: left
        });

        $scope.currentPage += 1;
      }
    };

    $scope.bookLayout = function () {
      var $reader = $('#reader'),
          $readerWrapper = $('#readerWrapper');

      $scope.activePage = 0;
      $scope.currentPage = 1;
      $reader.removeAttr('style').hide();

      var windowHeight = $(window).outerHeight() - 200,
          readerHeight = $reader.outerHeight(),
          column = Math.ceil(readerHeight / windowHeight),
          readerWrapperWidth = $readerWrapper.outerWidth(),
          readerWrapperHeight = $readerWrapper.outerHeight(),
          readerWidth = readerWrapperWidth * column;

      $scope.readerWrapperWidth = readerWrapperWidth;

      $reader.attr('style',
        'width: ' + readerWidth + 'px;' +
        '-webkit-column-count: ' + column + ';' +
        '-moz-column-count: ' + column + ';' +
        'column-count: ' + column + ';'
      );

      readerHeight = $reader.outerHeight();
      readerWrapperHeight = $readerWrapper.outerHeight();

      var line = parseInt($reader.css('line-height')),
          readerLines = Math.ceil(readerHeight / line),
          readerWrapperLines = Math.round(readerWrapperHeight / line),
          lines = ((readerLines - readerWrapperLines) * column);

      if (readerWrapperHeight >= line) {
        column += Math.ceil(lines / readerLines);
        readerWidth = readerWrapperWidth * column;
        $scope.readerWidth = readerWidth;
        $scope.pages = column;

        $reader.attr('style',
          'width: ' + readerWidth + 'px;' +
          '-webkit-column-count: ' + column + ';' +
          '-moz-column-count: ' + column + ';' +
          'column-count: ' + column + ';'
        ).show();
      }
    };

    $(function () {
      $scope.bookLayout();
    });

    $(window).resize(function () {
      $scope.bookLayout();
      $scope.$apply();
    });
  });
