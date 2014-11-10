'use strict';

angular.module('readerApp')
  .controller('MainCtrl', function ($scope) {
    $scope.readerWrapperWidth = 0;
    $scope.readerWidth = 0;
    $scope.activePage = 0;

    $scope.pagePrev = function () {
      if ($scope.activePage !== 0) {
        var left = $scope.activePage + $scope.readerWrapperWidth;

        $scope.activePage = left;

        $('#readerContent').css({
          marginLeft: left
        });
      }
    };

    $scope.pageNext = function () {
      var left = $scope.activePage - $scope.readerWrapperWidth;

      if (-left < $scope.readerWidth) {
        $scope.activePage = left;

        $('#reader').css({
          marginLeft: left
        });
      }
    };

    $scope.bookLayout = function () {
      var height = $(window).outerHeight(),
          $reader = $('#reader'),
          $readerWrapper = $('#readerWrapper');

      $reader.removeAttr('style').hide();

      $readerWrapper.css({
        top: height * 0.11
      });

      var windowHeight = $(window).outerHeight() - $(window).outerHeight() * 0.11 - $(window).outerHeight() * 0.22,
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

      column += Math.ceil(lines / readerLines);
      readerWidth = readerWrapperWidth * column;
      $scope.readerWidth = readerWidth;

      $reader.attr('style',
        'width: ' + readerWidth + 'px;' +
        '-webkit-column-count: ' + column + ';' +
        '-moz-column-count: ' + column + ';' +
        'column-count: ' + column + ';'
      ).show();

    };

    $(function () {
      $scope.bookLayout();
    });

    $(window).resize(function () {
      $scope.bookLayout();
    });
  });
