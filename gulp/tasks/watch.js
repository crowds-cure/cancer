const gulp = require('gulp');
const config = require('../config')

gulp.task('watch', function (cb) {
  return gulp.watch(`${config.src}/*`, ['build'], cb);
});