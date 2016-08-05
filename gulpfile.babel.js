'use strict';

// Import required modules
import gulp from 'gulp';
import util from 'gulp-util';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

// Set basic constants
const $ = gulpLoadPlugins(); // Module loading
const bs = browserSync.reload; // Browsersync - reload

// Configuration shortcuts
const cfg = require('./buildix.json'); // Basic configuration
const objPath = cfg.path; // Remapped path
const mod = cfg.module;

// Generate tasknames for dynamic binding between our buildix.json and gulpfile
// TODO: Maybe place this in a seperate plugin? 
var objTasks = () => {
	var taskList = {};

	// Security: Don't continue unless there is actually paths found
  if(!Object.keys(objPath).length) return false;

  // Iterate found paths and add a watch function
  for(var dir in objPath) {
    // Check watch pattern is defined in our path   
    if(objPath[dir]['watch'].length === 0 || typeof objPath[dir]['watch'] === 'undefined') {
      return false;
    }
    // Set taskname
    taskList[dir] = 'compile:' + dir;
	}
	return taskList;
};


// Error handling
var errorManager = class {
	constructor() {}

	emit(err) {
		// Emit warning
    $.util.beep();

    // Slit error message into smaller parts, to provide a better error message.
    var arrErrorMessage = err.message.split(" "),
        errorFile = arrErrorMessage[0].replace("\n", ""),
        errorLine = err.line,
        errorColumn = err.column;

    // Strip errormessage for filename and line/column numbers
    var errorMessage = err.message.replace(errorFile, "").replace(errorLine + ":" + errorColumn + " ", "").trim();

    // Construct errorMessage from new.
    var error = "\nFile: " + errorFile + "\n" +
                (typeof errorLine !== 'undefined' ? "Line: " + errorLine + "," : "") + (typeof errorColumn !== 'undefined' ? "Column: " + errorColumn +"\n" : "") +
                (typeof errorMessage !== 'undefined' ? "Reason: " + errorMessage : "");

    // Show visual warning in terminal  
    log({
      'title': mod.notify.title,
      'message': error,
      'statusColor': 'error',
      'status': 'error'
    });

    // Emit warning through notifier
    // Temporarily fix until we have a better solution than to run a stream
    gulp.src('')
        .pipe($.notify({
                    "title": mod.notify.title,
                    "subtitle": mod.notify.subtitle,
                    "message": error
                    })
        );

    // Emit end to gulp, so we make sure gulp is not hanging around to wait
    this.emit("end");

	}
}

// Tasks
gulp.task('compile:sass', () => {
	var ErrorManager = new errorManager();

	return gulp.src(objPath.sass.source)
         .pipe(mod.sourcemaps === true ? $.sourcemaps.init() : util.noop())
         .pipe($.sass(Object.keys(mod.sass.options).length > 0 ? mod.sass.options : {}))
         .on('error', ErrorManager.emit)
         .pipe($.autoprefixer(mod.autoprefixer))
         .pipe($.cssnano())
         .pipe(mod.sourcemaps === true ? $.sourcemaps.write() : util.noop())
         .pipe(gulp.dest(objPath.sass.target))
         .on('error', ErrorManager.emit)
         .pipe(mod.csssplit.enabled ? csssplit(mod.csssplit.opt) : util.noop())
         .pipe($.notify({
                          "title": cfg.environment.name,
                          "subtitle": cfg.environment.project,
                          "message": "Completed: CSS preprocessing"
                        })
              )
         .pipe(browserSync.reload({ stream: true }))
});

gulp.task('compile:script', () => {

});

/*
* Watch: Default task for our Gulp
**/
gulp.task('default', () => {
	// Create tasklist
	var objTasklist = new objTasks;
	
	// Iterate found paths and add a watch function
	for(var key in objTasklist) {
		var currentTask = objTasklist[key];
		// If our taskname exists in current tasklist, we're gonna add a watcher with task and bs.reload
		if(typeof gulp.tasks[currentTask] !== 'undefined') {
			console.log("Path", objPath[key]['watch']);
			gulp.watch(objPath[key]['watch'], [currentTask,bs]);
		} else {
			// Since we didn't find our task in tasklist, we're still gonna add a default watcher but only with a bs.reload binding
			gulp.watch(objPath[key]['watch'], bs);		
		}
	}
}); 
