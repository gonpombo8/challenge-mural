var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var wiredep = require('wiredep').stream;

gulp.task('run', () => {
	nodemon({
		script: 'app.js'
	})
});

gulp.task('bower', () => {
	gulp.src('app/index.html')
	.pipe(wiredep({
		directory: 'app/bower_components'
		}))
	.pipe(gulp.dest('app'));
});

gulp.task('serve', ['bower', 'run']);
