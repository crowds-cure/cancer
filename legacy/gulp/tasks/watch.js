const gulp = require('gulp');
const config = require('../config')

gulp.task('watch', function (cb) {
  gulp.watch(`${config.src}/**/*.js`, ['build'], cb);
  gulp.watch(`${config.src}/**/*.scss`, ['sass'], cb);
});