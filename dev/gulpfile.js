// initialize gulp plugins

const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const minifyCss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pngquant  = require('imagemin-pngquant');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');

// Configure Paths

// dest path
const dest = "../dist/";

const asset_dir = dest + "common/";
const asset_dir_css = asset_dir + "css/";
const asset_dir_img = asset_dir + "img/";
const asset_dir_js = asset_dir + "js/";

var running_tasks = [
  'sass',
  'pug',
  'browser-sync',
  'img_comp'
];

// render pug
gulp.task("pug", function() {
    gulp.src(
        ["pug/**/*.pug",'!' + "pug/**/_*.pug"]
    )
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({stream:true}));
});

// render sass
gulp.task('sass', function() {
  gulp.src(
      ["scss/**/*.scss",'!' + "scss/**/_*.scss"]
  )
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass({pretty: true}))
      .pipe(minifyCss({advanced:false}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(asset_dir + 'css/'))
  .pipe(browserSync.reload({stream:true}));
});

// compress images

gulp.task('img_comp', function() {
  gulp.src("img/**/*")
      .pipe(imagemin({
        use:[pngquant({
          quality: "60-80",
          speed: 1
        })]
      }))
      .pipe(gulp.dest(asset_dir_img))
  .pipe(browserSync.reload({stream:true}));
});

// js concat and uglify

// define js files as sorted
const js_source = 'js/';

var js_files_single = [
    // 'node_modules/jquery/dist/jquery.min.js',
    js_source + 'waypoints.min.js',
    js_source + 'scripts.js',
    js_source + 'bootstrap.min.js',
    js_source + 'jquery.flexslider.js',
    js_source + 'modernizr.js'
    // js_source + 'overlay.js',
];

gulp.task('js_single', function() {
  gulp.src("js/**/*.js")
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(uglify('app.min.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(asset_dir_js))
  .pipe(browserSync.reload({stream:true}));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: dest
        }
    });
});

// gulp command

gulp.task('default', running_tasks, function(){
  gulp.watch(['scss/**/*.scss'],['sass']);
  gulp.watch(['pug/**/*.pug'],['pug']);
  gulp.watch(['js/**/*.js'],[ 'js_single']);
  gulp.watch(['img/*'],['img_comp']);
});
