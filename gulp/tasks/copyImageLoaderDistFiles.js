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

gulp.task('copy:imgs', function () {
  return gulp.src(config.imgs)
    .pipe(gulp.dest('./public/imgs/'));
});
