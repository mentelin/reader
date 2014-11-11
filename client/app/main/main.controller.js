'use strict';

angular.module('readerApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.readerWrapperWidth = 0;
    $scope.readerWidth = 0;
    $scope.activePage = 0;
    $scope.pages = 1;
    $scope.currentPage = 1;
    $scope.fonts = [];
    $scope.font = '';

    var key = 'AIzaSyDkQO90-vrm4Lm_XahUtgAAuVgOZ--wg5w';

    $http.get('https://www.googleapis.com/webfonts/v1/webfonts?key=' + key).success(function (fonts) {
      $scope.fonts = fonts;
    });

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
        'column-count: ' + column + ';' +
        'font-family: ' + $scope.font + ';'
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
          'column-count: ' + column + ';' +
          'font-family: ' + $scope.font + ';'
        ).show();
      }
    };

    $scope.$watch('font', function () {
      if ($scope.font) {
        window.WebFontConfig = {
          google: {
            families: [$scope.font]
          }
        };

        $scope.bookLayout();
      }
    });

    $(function () {
      $scope.bookLayout();
    });

    $(window).resize(function () {
      $scope.bookLayout();
      $scope.$apply();
    });
  });
