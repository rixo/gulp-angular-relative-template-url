# gulp-angular-relative-template-url

Allows to write angular templateUrl relative to their source directory in 
the form `templateUrl: './my-template.html'`.

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

Development is still in **a very early stage**, it works on the projects where I need it,
but nothing has been consolidated yet...
