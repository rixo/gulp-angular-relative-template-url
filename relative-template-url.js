'use strict';

var path = require('path');
var rs = require('replacestream');
var Transform = require('readable-stream/transform');

module.exports = {
  html: function(options) {
    return relativeTemplateUrl(true, options);
  },
  js: function(options) {
    return relativeTemplateUrl(false, options);
  }
};

function relativeTemplateUrl(html, options) {

  // TODO
  var searches = html
    // regex for html
    ? [
      /((?:-|\b)template-url\b\s*=\s*['"])(\.{1,2}\/[^'"]+\.html)(['"])/g,
      /(\bng-include\b\s*=\s*(?:'"|"'))(\.{1,2}\/[^'"]+\.html)('"|"')/g,
      /(<ng-include[^>]+src\s*=\s*(?:'"|"'))(\.{1,2}\/[^'"]+\.html)('"|"')/g,
    ]
    // regex for js
    : [
      /\b(['"]?templateUrl['"]?\b\s*:\s*['"])(\.{1,2}\/[^'"]+)(['"])/g
    ];

  return new Transform({
    objectMode: true,
    transform: function(file, enc, callback) {
      if (file.isNull()) {
        return callback(null, file);
      }

      doReplace();

      function doReplace() {
        var dir = path.dirname(file.relative);
        if (options && options.prefix) {
          dir = path.join(options.prefix, dir);
        }
        var replacement = function(match, $1, $2, $3) {
          return $1 + path.normalize(path.join(dir, $2)) + $3;
        };

        if (file.isStream()) {
          searches.forEach(function(search) {
            file.contents.pipe(rs(search, replacement));
          });
        } else if (file.isBuffer()) {
          searches.forEach(function(search) {
            file.contents = new Buffer(
              String(file.contents).replace(search, replacement)
            );
          });

          //var contents = String(file.contents);
          //if (/templateUrl/.test(contents)) {
          //  console.log(file.relative, contents);
          //}
        }

        callback(null, file);
      }
    }
  });
}
