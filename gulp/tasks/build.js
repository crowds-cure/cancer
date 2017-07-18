const gulp = require('gulp');
const rename = require('gulp-rename');
const browserify = require('gulp-browserify');
const config = require('../config');

gulp.task('build', function () {
  return gulp.src(config.entry)
    .pipe(browserify())
    .pipe(rename(config.buildFileName))
    .pipe(gulp.dest(config.dist));
});
