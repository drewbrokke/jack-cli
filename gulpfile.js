var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function () {
	return gulp.src('src/**/*.ts')
		.pipe(tsProject())
		.pipe(gulp.dest('dist'));
});

gulp.task("tslint", () =>
	gulp.src('src/**/*.ts')
		.pipe(tslint())
		.pipe(tslint.report())
);

gulp.task('watch', () => {
	gulp.watch('src/**/*.ts', ['build', "tslint"]);
})

gulp.task('default', ['build']);