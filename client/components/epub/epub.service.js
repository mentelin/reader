(function ($, angular, JSZip) {
  'use strict';

  angular.module('readerApp')
    .factory('Epub', function () {
      return {
        book: {
          title: '',
          author: '',
          chapters: []
        },

        read: function (file, container) {
          var zip = new JSZip(file);

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
              ncxHref;
              // cssHref;

          // console.log(fullPath);
          // console.log(packageXml);
          // console.log(mainFolder);

          $packageXml.find('manifest').find('item').each(function () {
            var href = $(this).attr('href'),
                extension = href.substr(href.length - 3);

            if (extension === 'ncx') {
              // console.log($(this).attr('href'));

              ncxHref = $(this).attr('href');
            }
          });

          // console.log($packageXml.find('metadata').find('title').text());
          // console.log($packageXml.find('metadata').find('creator').text());

          this.book = {
            title: $packageXml.find('metadata').find('title').text(),
            author: $packageXml.find('metadata').find('creator').text()
          };

          // console.log(this.book);

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

          var chapters = [];

          $tocXml.find('navPoint').each(function () {
            var $content = $(this).find('content'),
                label = $(this).find('navLabel').find('text').text(),
                src = $content.attr('src');

            // console.log(src);

            navPoints.push(src);

            var navPointFile = zip.folder(mainFolder).file(src).asText(),
                navPointXml = $.parseXML(navPointFile),
                $navPointXml = $(navPointXml),
                chapter = {
                  label: label,
                  content: $navPointXml.find('body').html()
                };

            chapters.push(chapter);
          });

          this.book.chapters = chapters;

          $(container).html('');

          var chaptersContent = '';

          for (var i = 0; i < navPoints.length; i++) {
            var navPointFile = zip.folder(mainFolder).file(navPoints[i]).asText(),
                navPointXml = $.parseXML(navPointFile),
                $navPointXml = $(navPointXml),
                chapter = $navPointXml.find('body').html();

            // console.log(navPointXml);
            // console.log(chapter);
            // console.log(navPoints[i]);

            // localStorage[escape(this.book.name + '-' + navPoints[i])] = chapter;
            // $rootScope.chapters[escape(navPoints[i])] = chapter;
            chaptersContent += chapter;
          }

          $(container).append(chaptersContent);

          $(container).find('img').each(function () {
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

          $(container).find('*').each(function () {
            $(this).removeAttr('style');
          });

          $(container).addClass('ready');
        }
      };
    });
})(window.jQuery, window.angular, window.JSZip);
