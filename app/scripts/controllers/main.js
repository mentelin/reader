'use strict';

angular.module('mentelinApp')
  .controller('MainCtrl', function ($scope, $http, $upload) {
    var Book;

    $http.get('/api/books')
      .success(function (data) {
        $scope.books = data;
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });

    $http.get('/api/upload')
      .success(function (data) {
        $scope.files = data;
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });

    $scope.uploadFile = function ($files) {
      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];

        // console.log(file);

        var reader = new FileReader();

        reader.onload = (function (file) {
          return function (e) {
            // localStorage[escape(file.name)] = e.target.result;

            try {
              var zip = new JSZip(e.target.result);

              // $.each(zip.files, function (index, zipEntry) {
              //   console.log(zipEntry.name);
              // });

              var containerFile = zip.folder('META-INF').file('container.xml').asText(),
                  containerXml = $.parseXML(containerFile),
                  $containerXml = $(containerXml);

              console.log(containerXml);

              var fullPath = $containerXml.find('rootfile').attr('full-path'),
                  packageFile = zip.file(fullPath).asText(),
                  packageXml = $.parseXML(packageFile),
                  $packageXml = $(packageXml),
                  mainFolder = fullPath.substr(0, fullPath.lastIndexOf('/')),
                  ncxHref;

              console.log(fullPath);
              console.log(packageXml);
              console.log(mainFolder);

              $packageXml.find('manifest').find('item').each(function () {
                var href = $(this).attr('href'),
                    extension = href.substr(href.length - 3)

                if (extension == 'ncx') {
                  console.log($(this).attr('href'));

                  ncxHref = $(this).attr('href');
                }
              });

              var tocFile = zip.folder(mainFolder).file(ncxHref).asText(),
                  tocXml = $.parseXML(tocFile),
                  $tocXml = $(tocXml),
                  navPoints = [];

              console.log(tocXml);

              $tocXml.find('navPoint').find('content').each(function () {
                var src = $(this).attr('src');

                console.log(src);

                navPoints.push(src);
              });

              var navPointFile = zip.folder(mainFolder).file(navPoints[0]).asText(),
                  navPointXml = $.parseXML(navPointFile),
                  $navPointXml = $(navPointXml),
                  chapter = $navPointXml.find('body').html();

              console.log(navPointXml);
              console.log(chapter);

              $('#readerContent').html('');

              $('#readerContent').html(chapter);

              $('#modalReader').modal('toggle');
            }
            catch (e) {
              console.log('Error reading ' + file.name + ': ' + e.message);
            }
          };
        })(file);

        reader.readAsArrayBuffer(file);

        // $scope.upload = $upload.upload({
        //     url: '/api/upload',
        //     file: file
        //   })
        //   .progress(function (evt) {
        //     $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        //   })
        //   .success(function (data, status, headers, config) {
        //     $http.get('/api/upload')
        //       .success(function (data) {
        //         $scope.files = data;
        //       })
        //       .error(function (data) {
        //         console.log('Error: ' + data);
        //       });
        //   });
      }
    };

    $scope.deleteFile = function (file) {
      $http.delete('/books/' + file)
        .success(function (data) {
          $scope.message = data;

          $http.get('/api/upload')
            .success(function (data) {
              $scope.files = data;
            })
            .error(function (data) {
              console.log('Error: ' + data);
            });
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });
    };

    $scope.createBook = function () {
      $http.post('/api/books', $scope.book)
        .success (function (data) {
          $scope.book = {};
          $scope.books = data;
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });
    };

    // $scope.readBook = function (book) {
    //   Book = ePub(book.file);

    //   $('#readerContent').html('');

    //   Book.renderTo("readerContent");

    //   $('#modalReaderLabel').append(book.name);

    //   $('#modalReader').modal('toggle');
    // };

    // $scope.prevPage = function () {
    //   Book.prevPage();
    // };

    // $scope.nextPage = function () {
    //   Book.nextPage();
    // };

    $scope.updateBook = function (id) {
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

    $scope.deleteBook = function (id) {
      $http.delete('/api/books/' + id)
        .success(function (data) {
          $scope.books = data;
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });
    };
  });
