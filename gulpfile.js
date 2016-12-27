var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var bs = require('browser-sync').create();
var mocha = require('gulp-mocha');


// our browser-sync config + nodemon chain
gulp.task('browser-sync', ['nodemon'], function() {
    bs.init(null, {
        proxy: "http://localhost:9000",
        browser: "chromium-browser",
        port: 9100
    });
});

// the real stuff
gulp.task('default', ['browser-sync'], function () {
    gulp.watch('./views/**/*.jade', bs.reload);
    gulp.watch('./public/**/*.js', bs.reload);
    gulp.watch('./public/**/*.css', bs.reload);
    gulp.watch(['./routes/**/*.js', './util/**/*.js', './app.js', './bin/www'], ['bs-delay']);
});

// give nodemon time to restart
gulp.task('bs-delay', function () {
    setTimeout(function () {
        bs.reload({ stream: false });
    }, 1000);
});

// our gulp-nodemon task
gulp.task('nodemon', function (cb) {
    var started = false;
    return nodemon({
        script: './bin/www',
        ext: 'js',
        ignore: ['public/**/*.js'],
        env: {
            'NODE_ENV': 'development',
            'DEBUG': 'appname:*'
        }
    }).on('start', function () {
        //avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }
    })
        .on('crash', function() {
            console.log('nodemon.crash');
        })
        .on('restart', function() {
            console.log('nodemon.restart');
        })
        .once('quit', function () {
            // handle ctrl+c without a big weep
            process.exit();
        });
});

gulp.task('test', function() {
    gulp.src(['test/**.js'], { read: false})
        .pipe(mocha({
            reporter: 'spec',
            globals: {
                should: require('should')
            },
            timeout: 10000
        }));
});
