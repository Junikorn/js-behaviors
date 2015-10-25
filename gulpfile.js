'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ scope: ['devDependencies'], lazy: false });
var del = require('del');
var runSequence = require('run-sequence');

// Lint JavaScript
gulp.task('jshint', function(){
    return gulp.src([
        '*.js',
        '*.html',
        '!gulpfile.js'
    ])
        .pipe($.jshint.extract()) // Extract JS from .html files
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

// Copy all files at the root level (app)
//gulp.task('copy', function(){
//    return gulp.src(['*.html', '*.js', '!gulpfile.js'])
//        .pipe(gulp.dest('es5')).pipe($.size({title: 'copy'}));
//});

// Transpile all JS to ES5.
gulp.task('js', function () {
    return gulp.src(['*.{js,html}', '!gulpfile.js'])
        .pipe($.sourcemaps.init())
        .pipe($.if('*.html', $.crisper())) // Extract JS from .html files
        .pipe($.if('*.js', $.babel()))
        .pipe($.if('*.html', $.replace('../', '../../')))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('es5'));
});

// Clean output directory
gulp.task('clean', function(cb){
    del(['es5'], cb);
});

// Build production files, the default task
gulp.task('default', ['clean'], function(cb){
    runSequence('jshint', 'js', cb);
});

// Load tasks for web-component-tester
// Adds tasks for `gulp test:local` and `gulp test:remote`
require('web-component-tester').gulp.init(gulp);