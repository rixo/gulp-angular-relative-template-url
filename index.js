'use strict';

var path = require('path');
var rs = require('replacestream');
var Transform = require('readable-stream/transform');

module.exports = function relativeTemplateUrl(options) {

  // TODO
  var search = /\b(['"]?templateUrl['"]?\b\s*:\s*['"])\.\/([^'"]+)(['"])/;

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
          file.contents.pipe(rs(search, replacement));
        } else if (file.isBuffer()) {
          file.contents = new Buffer(
            String(file.contents).replace(search, replacement)
          );

          //var contents = String(file.contents);
          //if (/templateUrl/.test(contents)) {
          //  console.log(file.relative, contents);
          //}
        }

        callback(null, file);
      }
    }
  });
};
