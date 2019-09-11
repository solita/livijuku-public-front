import gulp from 'gulp';
import browserSync from 'browser-sync';
import project from '../aurelia.json';
import build from './build';
import httpProxy from 'http-proxy';
import {CLIOptions} from 'aurelia-cli';
import gutil from 'gulp-util';

function onChange(path) {
  console.log(`File Changed: ${path}`);
}

function reload(done) {
  browserSync.reload();
  done();
}

let serve = gulp.series(
  build,
  done => {
    var proxy = httpProxy.createProxyServer({
      changeOrigin: true,
      target: 'http://localhost:8080/public'
    });

    function proxyAPIRequests(req, res, next) {
      if (req.url.match(/^\/api/)) {
        req.url = req.url.replace('/api', '');
        proxy.web(req, res);
        return;
      }
      next();
    }

    browserSync({
      online: false,
      open: false,
      port: 9000,
      server: {
        baseDir: ['.'],
        middleware: [function(req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        }, proxyAPIRequests]
      }
    }, done);
  }
);

let refresh = gulp.series(
  build,
  reload
);

let watch = function() {
  gulp.watch(project.transpiler.source, refresh).on('change', onChange);
  gulp.watch(project.markupProcessor.source, refresh).on('change', onChange);
  gulp.watch(project.cssProcessor.source, refresh).on('change', onChange)
}

let run;

if (CLIOptions.hasFlag('watch')) {
  run = gulp.series(
    serve,
    watch
  );
} else {
  run = serve;
}

export default run;
