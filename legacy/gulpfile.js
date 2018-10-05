const requireDir = require('require-dir');
const gulp = require('gulp');

requireDir('./gulp/tasks');

gulp.task('develop', ['build', 'sass', 'copy:dist', 'copy:html', 'copy:imgs', 'server', 'watch']);
