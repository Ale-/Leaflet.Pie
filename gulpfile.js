const gulp        = require('gulp');
const concatenate = require('gulp-concat');
const uglify      = require('gulp-uglify');
const rename      = require('gulp-rename');
const babel       = require('gulp-babel');

console.log(babel);

const source_files = [
    'src/banner.js',
    'src/LeafletPie.js',
    'src/Util.js',
    'src/PieDataset.js',
    'src/Pie.js',
    'src/PieLegend.js',
]

gulp.task('default', function() {
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
