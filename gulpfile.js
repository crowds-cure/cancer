const requireDir = require('require-dir');
const gulp = require('gulp');

requireDir('./gulp/tasks');

gulp.task('develop', ['build', 'sass', 'copy:dist', 'server', 'watch']);
