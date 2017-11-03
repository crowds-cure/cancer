const gulp = require('gulp');
const server = require('gulp-webserver');
const config = require('../config');

gulp.task('server', function() {
  return gulp.src(config.dist)
    .pipe(server());
});
