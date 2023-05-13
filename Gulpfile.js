import gulp from "gulp";
import autoprefixer from "autoprefixer";
import {create} from "browser-sync";
import image from "gulp-image";
import jshint from "gulp-jshint";
import postcss from "gulp-postcss";
import gulpSass from "gulp-sass";
import dartSass from "sass";
const sass = gulpSass(dartSass);
import sourcemaps from "gulp-sourcemaps";
import newer from "gulp-newer";

const themeName = 'countrytheme';

const // Prepare and optimize code etc

	browserSync = create(),

	// Name of working theme folder
	root = '../' + themeName + '/',
	scss = root + 'sass/',
	js = root + 'js/',
	img = root + 'images/',
	languages = root + 'languages/';

// Starts a BrowerSync instance
gulp.task('server', function() {
	browserSync.init({
		open: 'external',
		proxy: 'http://ttmca.local/',
		port: 8080,
		injectChanges: true
	});}
);

// CSS via Sass and Autoprefixer
gulp.task('css', function() {
	return gulp.src(scss + '{style.scss,rtl.scss}')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded', indentType: 'tab', indentWidth: '1'
		}).on('error', sass.logError))
		.pipe(postcss([
			autoprefixer('last 2 versions', '> 1%')
		]))
		.pipe(sourcemaps.write('sass/maps'))
		.pipe(gulp.dest(root));
});

// Optimize images through gulp-image
gulp.task('images', function() {
	return gulp.src(img + 'RAW/**/*.{jpg,JPG,png}')
		.pipe(newer(img))
		.pipe(image())
		.pipe(gulp.dest(img));
});

// JavaScript
gulp.task('javascript', function() {
	return gulp.src([js + '*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default', true))
		.pipe(gulp.dest(js));
});

// Watch everything
gulp.task('watch', function() {
	gulp.watch([root + '**/*.css', root + '**/*.scss'], {ignoreInitial: false}, gulp.series('css'));
	gulp.watch(js + '**/*.js', gulp.series('javascript'));
	gulp.watch(img + 'RAW/**/*.{jpg,JPG,png}', gulp.series('images'));
	gulp.watch(root + '**/*').on('change', browserSync.reload);
});

// Default task (runs at initiation: gulp --verbose)
gulp.task('default', gulp.parallel('server', 'watch'));
