(function ($, angular, Dropbox, JSZipUtils) {
  'use strict';

  angular.module('readerApp')
    .controller('MainCtrl', function ($scope, $http, Epub) {
      $scope.readerWrapperWidth = 0;
      $scope.readerWidth = 0;
      $scope.activePage = 0;
      $scope.pages = 1;
      $scope.currentPage = 1;
      $scope.prevPage = 0;
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
      $scope.fontSize = 14;
      $scope.read = Epub.read;

      $scope.$watch(Epub.book, function (book) {
        $scope.book = book;
      });

      var key = 'AIzaSyDkQO90-vrm4Lm_XahUtgAAuVgOZ--wg5w',
          checkState,
          options = {
            success: function (files) {
              JSZipUtils.getBinaryContent(files[0].link, function (err, data) {
                if (err) {
                  throw err;
                }

                $scope.read(data, '#reader');

                checkState = setInterval(function () {
                  if ($('#reader').hasClass('ready')) {
                    $scope.bookLayout();

                    clearInterval(checkState);
                  }
                }, 1000);
              });
            },

            linkType: 'direct',

            multiselect: false,

            extensions: ['.epub']
          };

      $http.get('https://www.googleapis.com/webfonts/v1/webfonts?key=' + key).success(function (fonts) {
        $scope.fonts = fonts;
      });

      JSZipUtils.getBinaryContent('/assets/books/moby-dick.epub', function (err, data) {
        if (err) {
          throw err;
        }

        $scope.read(data, '#reader');

        checkState = setInterval(function () {
          if ($('#reader').hasClass('ready')) {
            $scope.bookLayout();

            clearInterval(checkState);
          }
        }, 1000);
      });

      $scope.pagePrev = function () {
        var left = $scope.activePage + $scope.readerLeft;

        if (left <= 0) {
          $scope.activePage = left;
          $scope.prevPage = $scope.currentPage;

          $('#reader').css({
            marginLeft: left
          });

          $scope.currentPage = parseInt($scope.currentPage) - 1;
        }
      };

      $scope.pageNext = function () {
        var left = $scope.activePage - $scope.readerLeft;

        if (-left < $scope.readerWidth) {
          $scope.activePage = left;
          $scope.prevPage = $scope.currentPage;

          $('#reader').css({
            marginLeft: left
          });

          $scope.currentPage = parseInt($scope.currentPage) + 1;
        }
      };

      $scope.bookLayout = function () {
        var $reader = $('#reader'),
            $readerWrapper = $('#readerWrapper'),
            style = 'font-family: ' + $scope.font + ';' +
              'font-size: ' + $scope.fontSize + 'px;' +
              'text-align: ' + $scope.textAlign + ';';

        $scope.activePage = 0;
        $scope.currentPage = 1;
        $reader.removeAttr('style').attr('style', style).hide();
        $('#sliderPages').find('.bar.steps').width(0);

        var windowHeight = $(window).outerHeight() - 200,
            readerHeight = $reader.outerHeight(),
            column = Math.ceil(readerHeight / windowHeight),
            readerWrapperWidth = $readerWrapper.outerWidth(),
            readerWrapperHeight = $readerWrapper.outerHeight(),
            readerWidth = readerWrapperWidth * column,
            readerWrapperOffset = 0,
            columnsWidth = readerWrapperWidth;

        style += 'width: ' + readerWidth + 'px;' +
          '-webkit-column-count: ' + column + ';' +
          '-moz-column-count: ' + column + ';' +
          'column-count: ' + column + ';';

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

          style = 'font-family: ' + $scope.font + ';' +
            'font-size: ' + $scope.fontSize + 'px;' +
            'text-align: ' + $scope.textAlign + ';';

          style += 'width: ' + readerWidth + 'px;' +
            '-webkit-column-count: ' + column + ';' +
            '-moz-column-count: ' + column + ';' +
            'column-count: ' + column + ';';

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
        }
      };

      $scope.checkStandalone = function () {
        if (window.navigator.standalone) {
          return 'standalone';
        }
      };

      $scope.uploadDropbox = function () {
        Dropbox.choose(options);
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

      $scope.$watch('fontSize', function () {
        $('#reader').css({
          fontSize: $scope.fontSize
        });

        $scope.bookLayout();
      });

      $scope.$watch('textAlign', function () {
        $('#reader').css({
          textAlign: $scope.textAlign
        });
      });

      $scope.$watch('columns', function () {
        $scope.bookLayout();
      });

      $scope.$watch('currentPage', function () {
        var left = ($scope.currentPage * $scope.readerLeft) - $scope.readerLeft;

        if ($scope.currentPage > $scope.prevPage) {
          if (-left < $scope.readerWidth) {
            $scope.activePage = -left;

            $('#reader').css({
              marginLeft: -left
            });
          }
        }
        else {
          if (left <= 0) {
            $scope.activePage = left;

            $('#reader').css({
              marginLeft: left
            });
          }
        }

        $scope.prevPage = $scope.currentPage;
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
})(window.jQuery, window.angular, window.Dropbox, window.JSZipUtils);
