var gulp = require("gulp");
var cleanCSS=require('gulp-clean-css');
var uglify = require('gulp-uglify');
/*gulp.task('js',function () {
    gulp.src('../server/views/dist/js/layout-js/!*').pipe(uglify()).pipe(gulp.dest('../layout_js'));
})*/
gulp.task('css', function() {
// 1. 找到文件
    gulp.src('../server/views/dist/css/*.css')
    // 2. 压缩文件
        .pipe(cleanCSS())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('../layout_css'))
})
gulp.task('default', ['css']);