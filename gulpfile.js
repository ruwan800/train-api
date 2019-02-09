const gulp = require('gulp');
const ts = require('gulp-typescript');
let sourcemaps = require("gulp-sourcemaps");
let rimraf = require("rimraf");
let runSequence = require("run-sequence");
let tslint = require("gulp-tslint");
let nodemon = require("gulp-nodemon");

const CLEAN_BUILD = "clean:build";
const TSLINT = "tslint";
const COMPILE_TYPESCRIPT = "compile:typescript";
const COPY_STATIC_FILES = "copy:static";
const BUILD = "build";

const TS_SRC_GLOB = "./src/**/*.ts";
const TS_GLOB = [TS_SRC_GLOB];
const STATIC_FILES = ['./src/**/*.json'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');


// Removes the ./dist directory with all its content.
gulp.task(CLEAN_BUILD, function (callback) {
    rimraf("./dist", callback);
});

// Checks all *.ts-files if they are conform to the rules specified in tslint.json.
gulp.task(TSLINT, function () {
    return gulp.src(TS_GLOB)
        .pipe(tslint({formatter: "verbose"}))
        .pipe(tslint.report({
            // set this to true, if you want the build process to fail on tslint errors.
            emitError: false
        }));
});

// Compiles all *.ts-files to *.js-files.
gulp.task(COPY_STATIC_FILES, function () {
    return gulp.src(STATIC_FILES)
        .pipe(gulp.dest("dist"));
});


gulp.task(COMPILE_TYPESCRIPT, function () {
    return gulp.src(TS_GLOB)
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write(".", {sourceRoot: "../src"}))
        .pipe(gulp.dest("dist"));
});

// Runs all required steps for the build in sequence.
gulp.task(BUILD, gulp.series(CLEAN_BUILD, TSLINT, COMPILE_TYPESCRIPT, COPY_STATIC_FILES));

// Runs the build task and starts the server every time changes are detected.
gulp.task("watch", function () {
    return nodemon({
        ext: "ts js json",
        script: "dist/server.js",
        watch: ["src/*", "test/*"],
        tasks: [BUILD],
    });
});
