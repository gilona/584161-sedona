"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();

var minify = require("gulp-csso");
var svgstore = require("gulp-svgstore");
var imagemin = require("gulp-imagemin");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var del = require("del");
var run = require("run-sequence");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");

gulp.task("style", function() {
  gulp.src("source/sass/style.scss")
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
  autoprefixer()
]))
  .pipe(gulp.dest("build/css"))
  .pipe(minify())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("build/css"))
  .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("source/img/**/*.{webp,png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({ optimizationLevel: 3 }),
    imagemin.jpegtran({ progressive: true }),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function() {
  return gulp.src("source/img/icon-*.svg")
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(gulp.dest("build"));
});

gulp.task("script", function() {
  gulp.src(["source/js/**/*.js"], ["!source/js/**/*.js"])
  .pipe(uglify())
  .pipe(rename(function(path) {
    path.basename += ".min";
  }))
  .pipe(gulp.dest("build/js"))
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("copy", function() {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("serve", function() {
  server.init({
    server: "build",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch("source/sass/**/*.scss", ["style"]);
  gulp.watch("source/js/**/*.js", ["script"]);
  gulp.watch("source/*.html", ["html"]).on("change", server.reload);
});

gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "style",
    "script",
    "images",
    "sprite",
    "html",
    fn
  );
});
