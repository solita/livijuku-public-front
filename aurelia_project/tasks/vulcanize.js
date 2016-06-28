// This is for concatenating Polymer components
gulp.task('vulcanize', () => {
  return gulp.src('elements.html')
    .pipe(vulcanize(
      {
        inlineScripts: true,
        stripComments: true
      }
    ))
    .pipe('/vulcanized-elements.html');
});
