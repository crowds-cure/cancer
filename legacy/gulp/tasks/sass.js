const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const config = require('../config');

gulp.task('sass', function () {
  return gulp.src(config.sassEntry)
          .pipe(sass().on('error', sass.logError))
          .pipe(rename(config.buildFileCSSName))
          .pipe(gulp.dest(config.dist));
});
