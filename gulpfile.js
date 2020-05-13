"use strict";

const gulp = require('gulp');

const browserSync = require('browser-sync').create()
const babelify = require('babelify')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const source = require('vinyl-source-stream')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')

gulp.task('build', function (done) {
    gulp.src('images/**').pipe(gulp.dest('./dist/images/'));
    gulp.src('stylesheets/**').pipe(gulp.dest('./dist/stylesheets/'))
    gulp.src('manifest.json').pipe(gulp.dest('./dist/'));

    browserify({entries: './main.js', debug: true})
      .transform(babelify, { presets: ['@babel/preset-env'] })
      .bundle()
      .on('error', err => console.log('Error : ' + err.message))
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist'))
      .pipe(browserSync.reload({stream: true}))

    done();
});
