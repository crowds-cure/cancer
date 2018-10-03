const gulp = require('gulp');
const config = require('../config');

gulp.task('copy:dist', function () {
  return gulp.src(config.imageLoaderDistFiles)
    .pipe(gulp.dest('./public/dist'));
});

// TODO: This is only temporary
gulp.task('copy:html', function () {
  return gulp.src(config.html)
    .pipe(gulp.dest('./public/'));
});
