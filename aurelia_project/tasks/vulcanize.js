import gulp from 'gulp';
import rename from 'gulp-rename';
import vulcanize from 'gulp-vulcanize';

// This is for concatenating Polymer components
export default function vulcanizeElements() {
  return gulp.src('src/elements.html')
    .pipe(vulcanize(
      {
        inlineScripts: true,
        stripComments: true
      }
    ))
    .pipe(rename('vulcanized-polymer-elements.html'))
    .pipe(gulp.dest('scripts'));
};
