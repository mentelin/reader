'use strict';

angular.module('mentelinApp')
  .controller('ReaderCtrl', function ($scope, $routeParams, $http) {
    var bookObj = {};

    // console.log($routeParams);

    $http.get('/api/books/' + $routeParams['id'])
      .success(function (data) {
        $scope.book = data;

        // console.log($scope.book);

        JSZipUtils.getBinaryContent($scope.book.file, function (err, data) {
            // console.log(data);

            if(err) {
              showError(elt, err);
              return;
            }

            try {
              var zip = new JSZip(data);

              // $.each(zip.files, function (index, zipEntry) {
              //   console.log(zipEntry.name);
              // });

              var containerFile = zip.folder('META-INF').file('container.xml').asText(),
                  containerXml = $.parseXML(containerFile),
                  $containerXml = $(containerXml);

              // console.log(containerXml);

              var fullPath = $containerXml.find('rootfile').attr('full-path'),
                  packageFile = zip.file(fullPath).asText(),
                  packageXml = $.parseXML(packageFile),
                  $packageXml = $(packageXml),
                  mainFolder = fullPath.substr(0, fullPath.lastIndexOf('/')),
                  ncxHref,
                  cssHref;

              // console.log(fullPath);
              console.log(packageXml);
              // console.log(mainFolder);

              $packageXml.find('manifest').find('item').each(function () {
                var href = $(this).attr('href'),
                    extension = href.substr(href.length - 3);

                if (extension === 'ncx') {
                  // console.log($(this).attr('href'));

                  ncxHref = $(this).attr('href');
                }
              });

              // console.log($packageXml.find('metadata').find('dtitle').text());
              // console.log($packageXml.find('metadata').find('creator').text());

              bookObj = {
                name: $packageXml.find('metadata').find('title').text(),
                author: $packageXml.find('metadata').find('creator').text()
              };

              // $('[data-ng-submit="createBook()"]').find('[data-ng-model="book.name"]').val(bookObj.name);
              // $('[data-ng-submit="createBook()"]').find('[data-ng-model="book.info"]').val(bookObj.author);

              // $packageXml.find('manifest').find('item').each(function () {
              //   var media = $(this).attr('media-type');

              //   if (media === 'text/css') {
              //     console.log($(this).attr('href'));

              //     cssHref = $(this).attr('href');
              //   }
              // });

              // var cssFile = zip.folder(mainFolder).file(cssHref).asText();

              // console.log(cssFile);

              // $('style').text(cssFile) .appendTo('head');

              var tocFile = zip.folder(mainFolder).file(ncxHref).asText(),
                  tocXml = $.parseXML(tocFile),
                  $tocXml = $(tocXml),
                  navPoints = [];

              // console.log(tocXml);

              $tocXml.find('navPoint').find('content').each(function () {
                var src = $(this).attr('src');

                // console.log(src);

                navPoints.push(src);
              });

              $('#readerContent').html('');

              for (var i = 0; i < navPoints.length; i++) {
                var navPointFile = zip.folder(mainFolder).file(navPoints[i]).asText(),
                    navPointXml = $.parseXML(navPointFile),
                    $navPointXml = $(navPointXml),
                    chapter = $navPointXml.find('body').html();

                // console.log(navPointXml);
                // console.log(chapter);

                $('#readerContent').append(chapter);
              }

              $('#readerContent').find('img').each(function () {
                if (this.length !== 0) {
                  var src = $(this).attr('src');

                  // console.log(this);
                  // console.log(src);

                  if (src !== '') {
                    var imgFile = zip.folder(mainFolder).file(src),
                        imgType = src.substr(src.lastIndexOf('.') + 1);

                    // console.log(imgType);

                    if (imgFile !== null) {
                      var buffer = imgFile.asArrayBuffer(),
                          binary = '',
                          bytes = new Uint8Array(buffer),
                          len = bytes.byteLength;

                      for (var i = 0; i < len; i++) {
                        binary += String.fromCharCode(bytes[i]);
                      }

                      var imgData = window.btoa(binary);

                      // console.log(imgData);

                      $(this).attr('src', 'data:image/' + imgType + ';base64,' + imgData);
                    }
                  }
                }
              });

              $('#modalReader').modal('toggle');
            }
            catch (e) {
              console.log('Error reading ' + file.name + ': ' + e.message);
            }
          });
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });

    $scope.readFile = function ($files) {
      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];

        // console.log(file);

        var reader = new FileReader();

        reader.onload = (function (file) {
          return function (e) {
            // localStorage[escape(file.name)] = e.target.result;
            bookObj.file = file.name;

            try {
              var zip = new JSZip(e.target.result);

              // $.each(zip.files, function (index, zipEntry) {
              //   console.log(zipEntry.name);
              // });

              var containerFile = zip.folder('META-INF').file('container.xml').asText(),
                  containerXml = $.parseXML(containerFile),
                  $containerXml = $(containerXml);

              // console.log(containerXml);

              var fullPath = $containerXml.find('rootfile').attr('full-path'),
                  packageFile = zip.file(fullPath).asText(),
                  packageXml = $.parseXML(packageFile),
                  $packageXml = $(packageXml),
                  mainFolder = fullPath.substr(0, fullPath.lastIndexOf('/')),
                  ncxHref,
                  cssHref;

              // console.log(fullPath);
              console.log(packageXml);
              // console.log(mainFolder);

              $packageXml.find('manifest').find('item').each(function () {
                var href = $(this).attr('href'),
                    extension = href.substr(href.length - 3);

                if (extension === 'ncx') {
                  // console.log($(this).attr('href'));

                  ncxHref = $(this).attr('href');
                }
              });

              // console.log($packageXml.find('metadata').find('dtitle').text());
              // console.log($packageXml.find('metadata').find('creator').text());

              bookObj = {
                name: $packageXml.find('metadata').find('title').text(),
                author: $packageXml.find('metadata').find('creator').text()
              };

              // $('[data-ng-submit="createBook()"]').find('[data-ng-model="book.name"]').val(bookObj.name);
              // $('[data-ng-submit="createBook()"]').find('[data-ng-model="book.info"]').val(bookObj.author);

              // $packageXml.find('manifest').find('item').each(function () {
              //   var media = $(this).attr('media-type');

              //   if (media === 'text/css') {
              //     console.log($(this).attr('href'));

              //     cssHref = $(this).attr('href');
              //   }
              // });

              // var cssFile = zip.folder(mainFolder).file(cssHref).asText();

              // console.log(cssFile);

              // $('style').text(cssFile) .appendTo('head');

              var tocFile = zip.folder(mainFolder).file(ncxHref).asText(),
                  tocXml = $.parseXML(tocFile),
                  $tocXml = $(tocXml),
                  navPoints = [];

              // console.log(tocXml);

              $tocXml.find('navPoint').find('content').each(function () {
                var src = $(this).attr('src');

                // console.log(src);

                navPoints.push(src);
              });

              $('#readerContent').html('');

              for (var i = 0; i < navPoints.length; i++) {
                var navPointFile = zip.folder(mainFolder).file(navPoints[i]).asText(),
                    navPointXml = $.parseXML(navPointFile),
                    $navPointXml = $(navPointXml),
                    chapter = $navPointXml.find('body').html();

                // console.log(navPointXml);
                // console.log(chapter);

                $('#readerContent').append(chapter);
              }

              $('#readerContent').find('img').each(function () {
                if (this.length !== 0) {
                  var src = $(this).attr('src');

                  // console.log(this);
                  // console.log(src);

                  if (src !== '') {
                    var imgFile = zip.folder(mainFolder).file(src),
                        imgType = src.substr(src.lastIndexOf('.') + 1);

                    // console.log(imgType);

                    if (imgFile !== null) {
                      var buffer = imgFile.asArrayBuffer(),
                          binary = '',
                          bytes = new Uint8Array(buffer),
                          len = bytes.byteLength;

                      for (var i = 0; i < len; i++) {
                        binary += String.fromCharCode(bytes[i]);
                      }

                      var imgData = window.btoa(binary);

                      // console.log(imgData);

                      $(this).attr('src', 'data:image/' + imgType + ';base64,' + imgData);
                    }
                  }
                }
              });
            }
            catch (e) {
              console.log('Error reading ' + file.name + ': ' + e.message);
            }
          };
        })(file);

        reader.readAsArrayBuffer(file);
      }
    };
  });
