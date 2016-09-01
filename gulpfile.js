'use strict';

var gulp        = require('gulp'),
    browserify  = require('browserify'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    maps        = require('gulp-sourcemaps'),
    source      = require('vinyl-source-stream'),
    cleanCss    = require('gulp-clean-css');

var packageJSON   = require('./package.json'),
    dependencies  = Object.keys(packageJSON && packageJSON.dependencies || {});

//TASKS

//Compile vendor scripts
gulp.task('vendors', function() {
  return browserify()
    .require(dependencies)
    .bundle()
    .pipe(source('vendor.bundle.js'))
    .pipe(gulp.dest(__dirname + '/public/scripts/libs'))
});

//Compile application scripts
gulp.task('app', function() {
  return browserify('src/app/app.js')
    .external(dependencies)
    .bundle()
    .pipe(source('app.bundle.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(__dirname + '/public/scripts'));
});

//Compile sass
gulp.task('compileSass', function() {
  return gulp.src('src/styles/scss/app.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('public/styles/css'));
});

//Copy leaflet.css file to public/styles/css
gulp.task('copyLeafletCss', function() {
  return gulp.src('node_modules/leaflet/dist/leaflet.css')
    .pipe(gulp.dest(__dirname + '/public/styles/css'));
});

//Copy leaflet img folder to public/styles/css
gulp.task('copyLeafletImg', function() {
  return gulp.src('node_modules/leaflet/dist/images/*')
    .pipe(gulp.dest(__dirname + '/public/styles/css/images'));
});

//Watch files
gulp.task('watchFiles', function() {
  gulp.watch('package.json', ['vendors']);
  gulp.watch('src/app/**', ['app']);
  gulp.watch('src/styles/scss/*.scss', ['compileSass']);
});

//Minify js scripts
gulp.task('minifyVendorScripts', function() {
  return gulp.src('public/scripts/libs/vendor.bundle.js')
   .pipe(uglify())
   .pipe(rename('vendor.bundle.min.js'))
   .pipe(gulp.dest('public/scripts/libs'));
});

gulp.task('minifyAppScripts', function() {
  return gulp.src('public/scripts/app.bundle.js')
   .pipe(uglify())
   .pipe(rename('app.bundle.min.js'))
   .pipe(gulp.dest('public/scripts'));
});

//Minify css
gulp.task('minifyCss', function() {
  return gulp.src('public/styles/css/app.css')
   .pipe(cleanCss())
   .pipe(rename('app.min.css'))
   .pipe(gulp.dest('public/styles/css'));
});

//Build applicaction
gulp.task('build', ['minifyVendorScripts', 'minifyAppScripts', 'minifyCss']);

//Serve
gulp.task('serve', ['vendors', 'app', 'copyLeafletCss', 'copyLeafletImg', 'compileSass', 'watchFiles']);
