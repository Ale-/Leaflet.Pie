// *************************************
//
//   Gulpfile
//
// *************************************
//
// Available tasks:
//   `gulp`
//   `gulp build`
//   `gulp sass`
//   `gulp watch`
//
// *************************************

// -------------------------------------
//   Required modules
// -------------------------------------
//
// gulp              : The streaming build system
// gulp-concatenate  : Concatenate files
// gulp-uglify       : Minify JavaScript with UglifyJS
// gulp-rename       : Rename files
// gulp-babel        : Transpiles ES6 to ES5
// gulp-sass         : Compile Sass
// gulp-watch        : Watch stream
//
// -------------------------------------

const gulp        = require('gulp');
const concatenate = require('gulp-concat');
const uglify      = require('gulp-uglify');
const rename      = require('gulp-rename');
const babel       = require('gulp-babel');
const sass        = require('gulp-sass');
const watch       = require('gulp-watch');

// -------------------------------------
//   Settings
// -------------------------------------
//
// source_files : Source js files
// sass_files   : Source sass files
//
// -------------------------------------

const source_files = [
    'src/banner.js',
    'src/LeafletPie.js',
    'src/Util.js',
    'src/PieDataset.js',
    'src/PieLegend.js',
]

const sass_files = [
    'src/style.sass',
]

// -------------------------------------
//   Task: Build
// -------------------------------------
//
// Build production minified js file from
// source js files
//
// -------------------------------------


gulp.task('build', function(){
  return gulp.src( source_files )
      .pipe(babel({
          presets: ["env"],
      }))
      .pipe(concatenate('LeafletPie.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
});

// -------------------------------------
//   Task: Sass
// -------------------------------------
//
// Build production minified css file from
// source sass files
//
// -------------------------------------

gulp.task('sass', function(){
  return gulp.src( sass_files )
      .pipe(sass({ outputStyle : 'compressed' }).on('error', sass.logError))
      .pipe(rename('LeafletPie.min.css'))
      .pipe(gulp.dest('dist'));
});

// -------------------------------------
//   Task: Watch
// -------------------------------------
//
// Watches live changes over source files
// and triggers compilation of dist files
//
// -------------------------------------

gulp.task('watch', function(){
  gulp.watch(source_files , ['build']);
  gulp.watch(sass_files , ['sass']);
});

//
// Set 'watch' as default gulp task
//
gulp.task('default', ['watch']);
