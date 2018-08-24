var gulp = require("gulp");
var cleanCSS=require('gulp-clean-css');
var uglify = require('gulp-uglify');
gulp.task('hunxiao', function() {
// 1. 找到文件
    gulp.src('../server/views/dist/js/layout-js/*.js')
    // 2. 压缩文件
        .pipe(uglify())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('../layout_js'))
})
gulp.task('default', ['hunxiao']);