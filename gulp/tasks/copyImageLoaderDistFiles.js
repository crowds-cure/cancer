const gulp = require('gulp');
const config = require('../config');

gulp.task('copy:dist', function () {
  return gulp.src(config.imageLoaderDistFiles)
    .pipe(gulp.dest('./dist'));
});
