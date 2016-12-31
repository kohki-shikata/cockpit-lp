var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var ejs  = require('gulp-ejs');
var pug = require('gulp-pug');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');

var dir = "../dist/";
var html_preprocessor = "pug";

var sassPaths = [
  'bower_components/normalize.scss/sass',
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];

var running_tasks = [
  'sass',
  'browser-sync',
  html_preprocessor
];


gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: dir
        }
    });
});

gulp.task("pug", function() {
    gulp.src(
        ["pug/**/*.pug",'!' + "pug/**/_*.pug"]
    )
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(dir))
    .pipe(browserSync.reload({stream:true}));
});


gulp.task("ejs", function() {
  gulp.src(
      ["ejs/**/*.html",'!' + "ejs/**/_*.html"]
  )
  .pipe(ejs())
  .pipe(gulp.dest(dir))
  .pipe(browserSync.reload({stream:true}));
});

var copy_js = [
  'bower_components/foundation-sites/dist/js/foundation.min.js',
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/motion-ui/dist/motion-ui.min.js',
  'bower_components/what-input/dist/what-input.min.js',
  'js/app.js',
];

var copy_css = [
'bower_components/motion-ui/dist/motion-ui.min.css',
];

gulp.task('copy', function () {
  gulp.src(copy_js)
   .pipe(gulp.dest(dir + 'common/js'));
  gulp.src(copy_css)
   .pipe(gulp.dest(dir + 'common/css'));
});

gulp.task('sass', function() {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest(dir + 'common/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('default', running_tasks, function() {
  gulp.watch(['scss/**/*.scss'], ['sass']);
  switch(html_preprocessor){
    case "pug":
      gulp.watch(['pug/**/*.pug'], ['pug']);
      break;

    case "ejs":
      gulp.watch(['ejs/**/*.html'], ['ejs']);
      break;
  }
});
