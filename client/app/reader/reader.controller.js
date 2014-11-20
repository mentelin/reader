'use strict';

angular.module('readerApp')
  .controller('ReaderCtrl', function ($scope, Epub) {
    $scope.read = Epub.read;

    $scope.readFile = function ($files) {
      var read = function (file) {
        return function (e) {
          var bookObj = {};

          // localStorage[escape(file.name)] = e.target.result;
          bookObj.file = file.name;

          try {
            $scope.read(e.target.result, '#readerContent');
          }
          catch (e) {
            console.log('Error reading ' + file.name + ': ' + e.message);
          }
        };
      };

      var checkState = setInterval(function () {
        console.log(reader.readyState);

        if (reader.readyState === 2) {
          if (!($('.block-drag-and-drop').hasClass('reading'))) {
            $('.block-drag-and-drop').addClass('reading');
          }

          var windowHeight = $(window).outerHeight() - $('.block-drag-and-drop').outerHeight(),
              readerHeight = $('#readerContent').outerHeight(),
              readerWrapperWidth = $('.reader-wrapper').outerWidth(),
              columnCount = Math.round(readerHeight / windowHeight),
              readerWidth = readerWrapperWidth * columnCount;

          console.log(windowHeight, readerHeight);

          $('#readerContent').attr('style',
            'width: ' + readerWidth + 'px;' + '-webkit-column-count: ' + columnCount + ';' + '-moz-column-count: ' + columnCount + ';' + 'column-count: ' + columnCount + ';'
          );

          clearInterval(checkState);
        }
      }, 1000);

      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];

        // console.log(file);

        var reader = new FileReader();

        reader.onload = read(file);

        reader.readAsArrayBuffer(file);

        console.log(reader.readyState);

        if (reader.readyState === 1) {
          checkState();
        }
      }
    };

    $scope.nextPage = function () {
      var width =  $('.reader-wrapper').outerWidth(),
          readerLeft = parseInt($('#readerContent').css('left')),
          left;

      console.log(readerLeft);

      if (readerLeft < 0) {
        left = readerLeft - width;
      }
      else {
        left = - width;
      }

      console.log(left);

      $('#readerContent').css({
        left: left
      });
    };

    $scope.prevPage = function () {
      var width = $('.reader-wrapper').outerWidth(),
          readerLeft = parseInt($('#readerContent').css('left')),
          left;

      console.log(readerLeft);

      if (readerLeft !== 0) {
        if (readerLeft < 0) {
          left = readerLeft + width;
        }
        else {
          left = width;
        }
      }

      console.log(left);

      $('#readerContent').css({
        left: left
      });
    };
  });
