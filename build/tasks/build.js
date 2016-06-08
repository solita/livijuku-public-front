var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var to5 = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var paths = require('../paths');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var mainBowerFiles = require('gulp-main-bower-files');
var imagemin = require('gulp-imagemin');
var vulcanize = require('gulp-vulcanize');

var onError = function(err) {
    console.log(err);
}

// transpiles changed es6 files to SystemJS format
// the plumber() call prevents 'pipe breaking' caused
// by errors from other gulp plugins
// https://www.npmjs.com/package/gulp-plumber
gulp.task('build-system', function() {
  return gulp.src(paths.source)
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(changed(paths.output, {extension: '.js'}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(to5(assign({}, compilerOptions.system())))
    .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '/src'}))
    .pipe(gulp.dest(paths.output));
});

// This is for concatenating Polymer components
gulp.task('vulcanize', function() {
  return gulp.src(paths.root + '/elements.html')
    .pipe(vulcanize(
      {
        inlineScripts: true,
        stripComments: true
      }
    ))
    .pipe(gulp.dest(paths.output));
});

// Use the bower.json file as the source and it will create a vinyl stream
// for each of the files main-bower-files return when parsing the bower.json.
gulp.task('main-bower-files', function() {
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
        .pipe(gulp.dest(paths.output + '/bower_components'));
});

// gulp.task('images', function() {
//     return gulp.src(paths.images + '/**/*')
//         .pipe(plumber({
//             errorHandler: onError
//         }))
//         .pipe(changed(paths.output + '/images'))
//         .pipe(imagemin())
//         .pipe(gulp.dest(paths.output + '/images'))
//         .pipe(notify({ message: 'Images task complete' }));
// });

// gulp.task('locale', function () {
//   return gulp.src(paths.locale + '/**/*')
//     .pipe(gulp.dest(paths.output + '/locale'));
// });

// copies changed html files to the output directory
gulp.task('build-html', function() {
  return gulp.src(paths.html)
    .pipe(changed(paths.output, {extension: '.html'}))
    .pipe(gulp.dest(paths.output));
});

gulp.task('build-scss', function() {
    return gulp.src(paths.scss)
    .pipe(plumber())
        .pipe(sourcemaps.init())
            .pipe(sass({
              outputStyle: 'compressed'
            }))
            .pipe(autoprefixer({
                browsers: [
                    'Android >= 2.3',
                    'BlackBerry >= 7',
                    'Chrome >= 9',
                    'Firefox >= 4',
                    'Explorer >= 9',
                    'iOS >= 5',
                    'Opera >= 11',
                    'Safari >= 5',
                    'ChromeAndroid >= 9',
                    'FirefoxAndroid >= 4',
                    'ExplorerMobile >= 9'
                ]
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(paths.output))
            .pipe(browserSync.stream());
});

// this task calls the clean task (located
// in ./clean.js), then runs the build-system
// and build-html tasks in parallel
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-system', 'build-html', 'build-scss', 'vulcanize'],
    callback
  );
});
