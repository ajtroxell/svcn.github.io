// VARIABLES
var gulp = require('gulp');
var gutil = require('gulp-util');
var merge = require('merge-stream');

var bower = require('gulp-bower');
var filter = require('gulp-filter');
var mainBowerFiles = require('main-bower-files');
var del = require('del');

var fs = require('fs');

var sass = require('gulp-sass');
var autoprefixer = require('autoprefixer');
var cleanCSS = require('gulp-clean-css');
var npmCleanCSS = require('clean-css');
var postcss = require('gulp-postcss');
var pxtorem = require('postcss-pxtorem');

var wait = require('gulp-wait');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var replace = require('gulp-string-replace');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');

var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var browserSync = require('browser-sync');

var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var prod = !!argv.prod;

var exec = require('child_process').exec;

// ASSET FOLDER PATHS
var paths = {
  images: {
    src: 'assets/src/images/',
    dest: 'assets/dist/images/',
  },
  scripts: {
    src: 'assets/src/js/',
    dest: 'assets/dist/js/',
  },
  styles: {
    src: 'assets/src/scss/',
    dest: 'assets/dist/css/',
  },
  theme: {
    src: './',
  },
};

// ASSET FILES
var files = {
  // STYLES
  main: paths.styles.src + '/',
  // SCRIPTS
  scriptsMain: [
    // paths.scripts.src + 'vendor/accessibility.js',
    // paths.scripts.src + 'vendor/accessible-nav.js',
    // paths.scripts.src + 'vendor/jquery.cycle2.js',
    // paths.scripts.src + 'vendor/jquery.cycle2.swipe.js',
    // paths.scripts.src + 'vendor/modal.js',
    // paths.scripts.src + 'vendor/jquery.validate.js',
    // paths.scripts.src + 'vendor/enquire.js',
    paths.scripts.src + 'vendor/ntc.js',
    paths.scripts.src + 'main.js',
  ],
  // scriptsHomepage: [paths.scripts.src + 'homepage.js'],
  // scriptsSubpage: [paths.scripts.src + 'subpage.js'],
  // IMAGES
  images: paths.images.src + '/',
};

var siteURL = 'http://svcn.local/';

// BROWSERSYNC
gulp.task('browser-sync', ['compress-css'], function () {
  var browserSyncFiles = [
    '*.{html,shtml,php,aspx,ascx,asp,inc}',
    '**/*.{html,shtml,php,aspx,ascx,asp,inc}',
    '!assets/dist/css/critical/*.css',
    'assets/dist/css/**/*.css',
    'assets/dist/js/**/*.js',
    'assets/dist/images/**/*.{png,gif,jpg,svg}',
  ];
  browserSync.init(browserSyncFiles, {
    proxy: siteURL,
  });

  gulp.watch(paths.styles.src + '**/*.scss', ['compress-css']);
  gulp.watch(paths.theme.src + '**/*.php', browserSync.reload);
  gulp.watch(paths.scripts.src + '**/*.js', ['compress-scripts']);
  gulp.watch(paths.images.src + '**/*', ['images']);
});

var processors = [
  autoprefixer({
    browsers: ['last 3 versions', 'IOS 8'],
    remove: false,
  }),
  pxtorem({
    rootValue: 16,
    unitPrecision: 5,
    propList: ['*'],
    replace: false,
  }),
];

// STYLES
gulp.task('styles', function () {
  return gulp
    .src(files.main + '*.scss')
    .pipe(wait(500))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .on(
      'error',
      notify.onError({
        message: 'styles failed',
      })
    )
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest));
});

// CLEAN CSS
gulp.task('clean-css', ['styles'], function () {
  return gulp
    .src(paths.styles.dest + '*.min.css', { read: false })
    .pipe(clean());
});

// COMPRESS STYLES
gulp.task('compress-css', ['clean-css'], function () {
  return gulp
    .src(paths.styles.dest + '*.css')
    .pipe(sass().on('error', sass.logError))
    .on(
      'error',
      notify.onError({
        message: 'css compression failed',
      })
    )
    .pipe(
      cleanCSS({
        level: {
          1: {
            specialComments: 0,
            removeUnusedAtRules: false,
            restructureRules: true,
          },
        },
        compatibility: '*',
        advanced: true,
        ieBangHack: true,
        ieFilters: true,
        iePrefixHack: true,
        ieSuffixHack: true,
        sourceMap: true,
      })
    )
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(
      notify({
        message: 'css compressed',
        onLast: true,
      })
    );
});

// JS LINT
gulp.task('jslint', function () {
  var main = gulp
    .src(paths.scripts.src + 'main.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on(
      'error',
      notify.onError({
        message: 'main.js linting failed',
      })
    );
  // var homepage = gulp
  //   .src(paths.scripts.src + 'homepage.js')
  //   .pipe(jshint())
  //   .pipe(jshint.reporter('jshint-stylish'))
  //   .pipe(jshint.reporter('fail'))
  //   .on(
  //     'error',
  //     notify.onError({
  //       message: 'homepage.js linting failed',
  //     })
  //   );
  // var subpage = gulp
  //   .src(paths.scripts.src + 'subpage.js')
  //   .pipe(jshint())
  //   .pipe(jshint.reporter('jshint-stylish'))
  //   .pipe(jshint.reporter('fail'))
  //   .on(
  //     'error',
  //     notify.onError({
  //       message: 'subpage.js linting failed',
  //     })
  //   );
  // return merge(main, homepage, subpage);
  return merge(main);
});

// SCRIPTS
gulp.task('scripts', ['jslint'], function () {
  var main = gulp
    .src(files.scriptsMain)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest));
  // var homepage = gulp
  //   .src(files.scriptsHomepage)
  //   .pipe(sourcemaps.init())
  //   .pipe(concat('homepage.js'))
  //   .pipe(sourcemaps.write('.'))
  //   .pipe(gulp.dest(paths.scripts.dest));
  // var subpage = gulp
  //   .src(files.scriptsSubpage)
  //   .pipe(sourcemaps.init())
  //   .pipe(concat('subpage.js'))
  //   .pipe(sourcemaps.write('.'))
  //   .pipe(gulp.dest(paths.scripts.dest));

  // return merge(main, homepage, subpage);
  return merge(main);
});

// CLEAN JS
gulp.task('clean-js', ['scripts'], function () {
  return gulp
    .src(paths.scripts.dest + '*.min.js', { read: false })
    .pipe(clean());
});

// COMPRESS SCRIPTS
gulp.task('compress-scripts', ['clean-js'], function () {
  return gulp
    .src(paths.scripts.dest + '*.js')
    .pipe(uglify())
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(
      notify({
        message: 'js compressed',
        onLast: true,
      })
    );
});

// IMAGES
gulp.task('images', function () {
  return gulp
    .src(paths.images.src + '**/*')
    .pipe(wait(1500))
    .pipe(newer(paths.images.dest))
    .pipe(
      imagemin([
        imagemin.gifsicle({
          interlaced: true,
        }),
        imagemin.jpegtran({
          progressive: true,
        }),
        imagemin.optipng({
          optimizationLevel: 5,
        }),
      ])
    )
    .pipe(gulp.dest(paths.images.dest))
    .on('error', gutil.log)
    .pipe(
      notify({
        message: 'images optimized',
        onLast: true,
      })
    );
});

// DEFAULT TASK
gulp.task('default', ['images'], function () {
  gulp.watch(paths.styles.src + '**/*.scss', ['compress-css']);
  gulp.watch(paths.scripts.src + '**/*.js', ['compress-scripts']);
  gulp.watch(paths.images.src + '**/*', ['images']);
});
