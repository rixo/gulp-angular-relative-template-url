# gulp-angular-relative-template-url

Allows to write angular templateUrl relative to their source directory in 
the form `templateUrl: './my-template.html'`.

Development is still in **a very early stage**, it works on the projects where I need it,
but nothing has been consolidated yet...

## Usage with generator-gulp-angular

Works well with [`generator-gulp-angular`](https://github.com/Swiip/generator-gulp-angular),
if you modify the *scripts* task as such:

    gulp.task('scripts', function () {
      return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))

        // adds the plugin and a dest for files (this is needed when no
        // preprocessors like ES6 or coffee are used with the generator)
        .pipe($.angularRelativeTemplateUrl({
          prefix: 'app/'
        }))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app')))

        .pipe(browserSync.reload({ stream: true }))
        .pipe($.size())
    });
    
When not using a preprocessor, we also need to rewrite the `listFile()` function in the
`karma.conf.js` file in order to use the generated files instead of the original ones:
    
    function listFiles() {
      var wiredepOptions = _.extend({}, conf.wiredep, {
        dependencies: true,
        devDependencies: true
      });
    
      return wiredep(wiredepOptions).js
        .concat([
          // These lines have been changed for relative-templates, from:
          //
          //     path.join(conf.paths.src, '/app/**/*.module.js'),
          //     path.join(conf.paths.src, '/app/**/*.js'),
          //     path.join(conf.paths.src, '/**/*.spec.js'),
          //     path.join(conf.paths.src, '/**/*.mock.js'),
          //
          path.join(conf.paths.tmp, '/serve/app/**/*.module.js'),
          path.join(conf.paths.tmp, '/serve/app/**/*.js'),
          path.join(conf.paths.tmp, '/**/*.spec.js'),
          path.join(conf.paths.tmp, '/**/*.mock.js'),
          // This was already there
          path.join(conf.paths.src, '/**/*.html')
        ]);
    }

