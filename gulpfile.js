var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var watchify    = require('watchify');
var browserSync = require('browser-sync');
var modRewrite  = require('connect-modrewrite');
var gulp        = require('gulp');
var rename      = require('gulp-rename');
var gutil       = require('gulp-util');
var sass        = require('gulp-sass');

var fs          = require("fs");
var path        = require("path");
var url         = require("url");

// The default file if the file/path is not found
var defaultFile = "index.html";

// If that's not your case, just use `__dirname`
var folder = path.resolve(__dirname + '/client');

var paths = {
  scripts: [
    './src/index.js', 
  ],
  styles: [
    './styles/main.scss',
    './styles/*.scss',
    './styles/**/*.scss'
  ],
  specs: [
    './__tests__'
  ]
};

gulp.task('watchify', function(){
  console.log(watchify.args);
  var bundler = watchify(browserify(paths.scripts[0], watchify.args));

  var bundle  = function() {
    return bundler
      .bundle()
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./build'))
      .pipe(browserSync.reload({stream: true, once: true}));
  };

  bundler.on('update', bundle);

  return bundle();
});

// start server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './'
            // middleware: function(req, res, next) {
            //     var fileName = url.parse(req.url);
            //     fileName = fileName.href.split(fileName.search).join("");
            //     var fileExists = fs.existsSync(folder + fileName);
            //     if (!fileExists && fileName.indexOf("browser-sync-client") < 0) {
            //         req.url = "/" + defaultFile;
            //     }
            //     return next();
            // }
        },
        notify: false
    });
});

gulp.task('sass', function(){
  gulp.src(paths.styles[0])
    .pipe(sass({
      includePaths: require('node-neat').includePaths
    }))
    .on('error', function(e) {
      gutil.log('Sass Error', e);
    })
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('watch', function(){
  gulp.watch(paths.scripts, ['watchify']);
  gulp.watch(paths.styles, ['sass']);
  // gulp.watch(paths.specs, ['jest']);
});

// use default task to launch BrowserSync and watch JS files
gulp.task('default', ['browser-sync','watchify', 'sass', 'watch']);