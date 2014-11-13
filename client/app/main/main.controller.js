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
    $scope.textAlign = 'left';
    $scope.columns = 1;
    $scope.readerWrapperOffset = 0;
    $scope.theme = 'white';
    $scope.readerLeft = 0;
    $scope.isopen = {
      content: false,
      settings: false,
      navbar: false
    };
    $scope.book = {
      title: 'Идиот',
      author: 'Ф. М. Достоевский'
    };

    var key = 'AIzaSyDkQO90-vrm4Lm_XahUtgAAuVgOZ--wg5w';

    $http.get('https://www.googleapis.com/webfonts/v1/webfonts?key=' + key).success(function (fonts) {
      $scope.fonts = fonts;
    });

    $scope.pagePrev = function () {
      var left = $scope.activePage + $scope.readerLeft;

      if (left <= 0) {
        $scope.activePage = left;

        $('#reader').css({
          marginLeft: left
        });

        $scope.currentPage -= 1;
      }
    };

    $scope.pageNext = function () {
      var left = $scope.activePage - $scope.readerLeft;

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
          readerWidth = readerWrapperWidth * column,
          readerWrapperOffset = 0,
          columnsWidth = readerWrapperWidth,
          style = 'width: ' + readerWidth + 'px;' +
            '-webkit-column-count: ' + column + ';' +
            '-moz-column-count: ' + column + ';' +
            'column-count: ' + column + ';' +
            'font-family: ' + $scope.font + ';' +
            'text-align: ' + $scope.textAlign + ';';

      if ($readerWrapper.length > 0) {
        readerWrapperOffset = $readerWrapper.offset().left;
      }

      $scope.readerWrapperWidth = readerWrapperWidth;
      $scope.readerWrapperOffset = readerWrapperOffset;

      if ($scope.columns === 2) {
        style += '-webkit-column-gap: ' + readerWrapperOffset + 'px;' +
          '-moz-column-gap: ' + readerWrapperOffset + 'px;' +
          'column-gap: ' + readerWrapperOffset + 'px;' +
          '-webkit-columns: ' + (((columnsWidth - readerWrapperOffset) / $scope.columns) - 10) + 'px;' +
          '-moz-columns: ' + (((columnsWidth - readerWrapperOffset) / $scope.columns) - 10) + 'px;' +
          'columns: ' + (((columnsWidth - readerWrapperOffset) / $scope.columns) - 10) + 'px;';
      }

      $reader.attr('style', style);

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

        style = 'width: ' + readerWidth + 'px;' +
          '-webkit-column-count: ' + column + ';' +
          '-moz-column-count: ' + column + ';' +
          'column-count: ' + column + ';' +
          'font-family: ' + $scope.font + ';' +
          'text-align: ' + $scope.textAlign + ';';

        if ($scope.columns === 2) {
          style += '-webkit-column-gap: ' + readerWrapperOffset + 'px;' +
            '-moz-column-gap: ' + readerWrapperOffset + 'px;' +
            'column-gap: ' + readerWrapperOffset + 'px;' +
            '-webkit-columns: ' + (((columnsWidth - readerWrapperOffset) / $scope.columns) - 10) + 'px;' +
            '-moz-columns: ' + (((columnsWidth - readerWrapperOffset) / $scope.columns) - 10) + 'px;' +
            'columns: ' + (((columnsWidth - readerWrapperOffset) / $scope.columns) - 10) + 'px;';
        }

        $reader.attr('style', style).show();

        var left = [],
            leftPages = [],
            leftNumber = 1;

        $reader.find('*').each(function () {
          left.push($(this).position().left);

          $.each(left, function (i, el) {
            if ($.inArray(el, leftPages) === -1) {
              leftPages.push(el);
            }
          });
        });

        if ($scope.columns === 2) {
          leftNumber = 2;
        }

        $scope.readerLeft = leftPages[leftNumber];
      }
    };

    $scope.toggleNavbar = function () {
      if ($scope.isopen.navbar || $scope.isopen.settings || $scope.isopen.content || !($('.navbar-fixed-top').hasClass('open'))) {
        $('.navbar-fixed-top').addClass('open');
        $('.navbar-fixed-bottom').addClass('open');

        $scope.isopen.navbar = false;
      }
      else {
        $('.navbar-fixed-top').removeClass('open');
        $('.navbar-fixed-bottom').removeClass('open');

        $scope.isopen.navbar = true;
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

    $scope.$watch('textAlign', function () {
      $('#reader').css({
        textAlign: $scope.textAlign
      });
    });

    $scope.$watch('columns', function () {
      $scope.bookLayout();
    });

    $scope.$watch('theme');

    $scope.$watch('isopen.content', function () {
      if ($scope.isopen.navbar || $scope.isopen.settings || $scope.isopen.content || !($('.navbar-fixed-top').hasClass('open'))) {
        $('.navbar-fixed-top').addClass('open');
      }
      else {
        $('.navbar-fixed-top').removeClass('open');

        if ($('.navbar-fixed-bottom').hasClass('open')) {
          $('.navbar-fixed-bottom').removeClass('open');
        }
      }
    });

    $scope.$watch('isopen.settings', function () {
      if ($scope.isopen.navbar || $scope.isopen.settings || $scope.isopen.content || !($('.navbar-fixed-top').hasClass('open'))) {
        $('.navbar-fixed-top').addClass('open');
      }
      else {
        $('.navbar-fixed-top').removeClass('open');

        if ($('.navbar-fixed-bottom').hasClass('open')) {
          $('.navbar-fixed-bottom').removeClass('open');
        }
      }
    });

    $(function () {
      $scope.bookLayout();
    });

    $(window).resize(function () {
      if ($(window).outerWidth() <= 768) {
        $scope.columns = 1;
      }

      $scope.bookLayout();
      $scope.$apply();
    });
  });
