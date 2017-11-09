const gulp        = require('gulp');
const concatenate = require('gulp-concat');
const uglify      = require('gulp-uglify');
const rename      = require('gulp-rename');
const babel       = require('gulp-babel');
const sass        = require('gulp-sass');
const watch       = require('gulp-watch');

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

gulp.task('build', function(){
  return gulp.src( source_files )
      .pipe(babel({
          presets: ["env"],
      }))
      .pipe(concatenate('LeafletPie.src.js'))
      .pipe(gulp.dest('dist'))
      .pipe(rename('LeafletPie.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
});

gulp.task('sass', function(){
  return gulp.src( sass_files )
      .pipe(sass({ outputStyle : 'compressed' }).on('error', sass.logError))
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
  gulp.watch(source_files , ['build']);
  gulp.watch(sass_files , ['sass']);
});

gulp.task('default', ['watch']);
