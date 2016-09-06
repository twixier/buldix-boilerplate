'use strict';

// Import required modules
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

// Packages
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglifyify from 'uglifyify';
import babelify from 'babelify';

// Buildix
import buildix from 'buildix-util';

// Set basic constants
const $ = gulpLoadPlugins(); // Module loading
const bs = browserSync.reload; // Browsersync - reload

// Configuration shortcuts
const cfg = require('./buildix.json'); // Basic configuration
const objPath = cfg.path; // Remapped path
const mod = cfg.module;

/**
* SASS
* Task for compiling SASSS into CSS
**/
gulp.task('compile:sass', () => {

	return gulp.src(objPath.sass.source)
         .pipe(mod.sourcemaps === true ? $.sourcemaps.init() : $.util.noop())
         .pipe($.sass(mod.sass.options))
         .on('error', $.sass.logError)
         .pipe($.autoprefixer(mod.autoprefixer))
         .pipe($.cssnano(mod.cssnano.options))
         .pipe(mod.sourcemaps === true ? $.sourcemaps.write() : $.util.noop())
         .pipe(gulp.dest(objPath.sass.target))
         .pipe(mod.csssplit.enabled ? csssplit(mod.csssplit.opt) : $.util.noop())
         .pipe($.notify({
                          "title": cfg.environment.name,
                          "subtitle": cfg.environment.project,
                          "message": "Completed: CSS preprocessing"
                        })
              )
});

/**
* Javascript
* Task for compiling for dev/prod es5/es6 javascript
**/
gulp.task('compile:script', () => {
 // Compile develoment javascript
  var devel = browserify({
    entries: objPath.script.source,
    debug: true
  });

  devel.transform(babelify)
			 .bundle()
       .pipe(source('bundle.dev.js'))
       .pipe(buffer())
       .pipe($.rename('app.min.dev.js'))
       .pipe(mod.sourcemaps === true ? $.sourcemaps.init() : $.util.noop())
       .pipe(gulp.dest(objPath.script.target))
       .pipe(mod.sourcemaps === true ? $.sourcemaps.write() : $.util.noop())
       .pipe($.notify({
            "title": cfg.environment.name,
            "subtitle": cfg.environment.project,
            "message": "Completed: javascript compiling (dev)"
          })
       );

  // Compile production javascript
  var prod = browserify({
    entries: objPath.script.source,
    debug: false
  });
  
	prod.transform(babelify)
			.transform(uglifyify)
			.bundle()
      .pipe(source('bundle.prod.js'))
      .pipe(buffer())
      .pipe($.rename('app.min.js'))
      .pipe(gulp.dest(objPath.script.target))
			.pipe($.notify({
            "title": cfg.environment.name,
            "subtitle": cfg.environment.project,
            "message": "Completed: javascript compiling (prod)"
          })
       )
});

/**
* Images
* Opitimize images found in our local image (library) store
**/
gulp.task('compile:images', () => {
});

/**
* Browsersync
* Connect to browser and perform an update when changes are being maded to source files
**/
gulp.task('browsersync:start', (done) => {
	browserSync(mod.browsersync.options, function () {
    done();
  });
});

/*
* Default
* Bind task and connect it to required tasks.
* If a path-settings don't have a watch option, bind an browsersync.reload event instead.
**/
gulp.task('default', gulp.series('browsersync:start', (done) => {
  var objTasklist = buildix.tasklist(objPath),
      arrTasks = gulp.tree().nodes,
      arrPrivateTasks = ['default', 'browsersync:start'];
  
  if(!Object.keys(objTasklist).length) return false;
  
  for(var task in objTasklist) {
    var currentTask = objTasklist[task];
    if(arrTasks.indexOf(currentTask) > -1) {
      var key = currentTask.replace('compile:','');
      
      // Create watcher and bind required events
      gulp.watch(objPath[key]['watch'], gulp.series(currentTask, bs))
      .on('change', (path) => {
        console.log("Update: ", path);
      })
    }
  }
  
  done();
})); 
