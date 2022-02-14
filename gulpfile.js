const gulp = require("gulp")
const del = require('del')
const ts = require("gulp-typescript")
const merge = require('merge2')

const paths = {
    config: ["src/config/**/*.json"]
}

gulp.task('clean', function(){
  return del('./dist', {force:true});
});

gulp.task("copy-static-file", function () {
  return gulp.src(paths.config).pipe(gulp.dest("dist/config"))
});

gulp.task("compile-ts", function () {
  const tsProject = ts.createProject("tsconfig.json")
  const tsResult = tsProject.src().pipe(tsProject())

  return merge([
    tsResult.dts.pipe(gulp.dest('dist/types')),
    tsResult.js.pipe(gulp.dest('dist/'))
  ])
})

gulp.task("default", gulp.series('clean',"compile-ts","copy-static-file"))