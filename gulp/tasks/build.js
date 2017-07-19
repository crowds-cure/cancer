const gulp = require('gulp');
const rename = require('gulp-rename');
const browserify = require('gulp-browserify');
const config = require('../config');

gulp.task('build', function () {
  return gulp.src(config.entry)
    .pipe(browserify({
      transform: ['babelify']
    }))
    .pipe(rename(config.buildFileJsName))
    .pipe(gulp.dest(config.dist));
});
