var gulp = require('gulp');
var browserSync = require('browser-sync');
var httpProxy = require('http-proxy');
var gutil = require('gulp-util');

function handleError(err) {
  gutil.log(err);
  gutil.beep();

  if (production) {
    throw err;
  }

  notifier.notify({
    title: 'Compile Error',
    message: err.message
  });

  return this.emit('end');
};

// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000
gulp.task('serve', ['build'], function(done) {

  var proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    target: 'http://localhost:8082'
  });

  proxy.on('error', handleError);

  function proxyAPIRequests(req, res, next) {
    if (req.url.match(/^\/api/)) {
      req.url = req.url.replace('/api', '');
      proxy.web(req, res);
      return;
    }
    next();
  }

  function addAuthenticationHeaders(req, res, next) {

    req.headers['oam_remote_user'] = 'juku_hakija';
    req.headers['oam_groups'] = 'juku_hakija';
    req.headers['oam_user_organization'] = 'helsingin seudun liikenne';

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
      }, addAuthenticationHeaders, proxyAPIRequests]
    }
  }, done);
});

// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000
gulp.task('serve-bundle', ['bundle'], function(done) {
  browserSync({
    online: false,
    open: false,
    port: 9000,
    server: {
      baseDir: ['.'],
      middleware: function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  }, done);
});
