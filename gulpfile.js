  // --------------------
// #GULP
// --------------------

//configure paths
var config = {
  build        :   './app/',
  source       :   './ui_src',
  pugDir      :   './ui_src/pug',
  sassDir      :   './ui_src/scss',
  jsDir        :   './ui_src/javascript',
  iconsDir     :   './ui_src/icons',
  imageDir     :   './ui_src/images',
  fontDir     :   './ui_src/fonts',
  bowerDir     :   './bower_components',
  bootstrapDir :   './bower_components/bootstrap-sass/assets'
}

//include plug-ins
var gulp            = require('gulp'),
    gutil           = require('gulp-util'),
    sourcemaps      = require('gulp-sourcemaps'),
    sass            = require('gulp-sass'),
    notify          = require("gulp-notify"),
    //browserSync     = require('browser-sync').create(),
    bower           = require('gulp-bower');
    bowerFiles      = require('main-bower-files'),
    pug             = require('gulp-pug');
    changed         = require('gulp-changed');
    cached          = require('gulp-cached');
    gulpif          = require('gulp-if');
    filter          = require('gulp-filter'),
    runTimestamp    = Math.round(Date.now()/1000);

gulp.task('fonts', function () {
    return gulp.src('./fonts.list')
        .pipe(googleWebFonts())
        .pipe(gulp.dest(config.build + '/assets/fonts'));
});

//Start Static server
// gulp.task('browser-sync', function() {
//   browserSync.init({
//       server: {
//           baseDir: config.build,
//           directory: true
//       },
//       port: 3000,
//       files: ["*/**/*.css", "*/**/*.html", "*/**/*.js"]

//   });
// });

//SASS TO CSS
gulp.task('build-css', function() {
  return gulp.src(config.sassDir + '/**/*.scss')
    .pipe(sourcemaps.init())  // Process the original sources
    .pipe(sass({
        includePaths: [config.bootstrapDir+"/stylesheets", config.bowerDir+"animate.css"]
      })
      .on("error", notify.onError(function (error) {

                return "Error: " + error.message;

            })))
    .pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest(config.build + '/assets/stylesheets'))
    // .pipe(browserSync.stream());
});

//pug TO HTML – build .pug to .html
// gulp.task('build-html', function() {
//   gulp.src(config.pugDir + '/**/!(_)*.pug')
//     .pipe(pug({
//         pretty: true,
//         locals: {imagePath: 'assets/i'}
//       })
//       .on("error", notify.onError(function (error) {
//             return "Error: " + error.message;
//           })))
//     .pipe(gulp.dest(config.build));

//     gulp.src(config.source + '/**/*.html')
//       .pipe(gulp.dest(config.build + '/**/*.html'));
// });

//JS
gulp.task('build-once', function() {
  gulp.src(bowerFiles())
    .pipe(filter('*.js'))
    .pipe(gulp.dest(config.build + '/assets/javascript/vendor'));

  gulp.src(config.bootstrapDir + '/fonts/**/*')
    .pipe(gulp.dest(config.build + '/assets/fonts'));

  gulp.src(config.imageDir + '/**/*')
    .pipe(gulp.dest(config.build + '/assets/images'));

  gulp.src(config.fontDir + '/**/*')
    .pipe(gulp.dest(config.build + '/assets/fonts/fa'));
});

//JS
gulp.task('build-js', function() {
  gulp.src(config.source + '/**/*.js')
    .pipe(gulp.dest(config.build + '/assets'));
});

//Watch changes to the file
gulp.task('watch', function() {
  gulp.watch(config.jsDir + '/**/*.js', ['build-js']);
  gulp.watch(config.sassDir + '/**/*.scss', ['build-css']);
  //gulp.watch(config.pugDir + '/**/*.pug', ['build-html']);
  //gulp.watch(config.source + '/**/*.html').on('change', browserSync.reload);
});

// create a default task and just log a message
gulp.task('default', ['build-once','build-css', 'build-js'], function() {
  return gutil.log('Gulp is running in Development mode!');
});