/**
 * Created by aaron.jin on 15/6/10.
 */
/**
 * Created by aaron.jin on 15/6/8.
 */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    bourbon=require('node-bourbon');


// 守望者
gulp.task('watch', function() {
    gulp.watch('src/styles/**/*.scss', ['styles']);
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    gulp.watch('src/images/**/*', ['images']);
});

gulp.task('styles',function(){
    return gulp.src('src/styles/**/*.scss')
        .pipe(sass({ style: 'expanded',includePaths: bourbon.includePaths}))
        .on('error', swallowError)
        .pipe(autoprefixer())
        //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('tmp/styles'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('publish/styles'))
        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('tmp/scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(gulp.dest('publish/scripts'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('lib', function() {
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/EaselJS/lib/easeljs-0.8.1.combined.js',
        'bower_components/SoundJS/lib/soundjs-0.6.1.combined.js',
        'bower_components/PreloadJS/lib/preloadjs-0.6.1.combined.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('tmp/scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(gulp.dest('publish/scripts'))
        .pipe(notify({ message: 'Lib task complete' }));
});

// 图片
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .on('error', swallowError)
        .pipe(gulp.dest('publish/images'))
        .pipe(notify({ message: 'Images task complete' }));
});

// 清理
gulp.task('clean', function() {
    return gulp.src(['publish/styles', 'publish/scripts', 'publish/images','tmp/styles', 'tmp/scripts', 'tmp/images'], {read: false})
        .pipe(clean());
});

// 预设任务
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts','lib', 'images');
});

function swallowError (error) {

    //If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}