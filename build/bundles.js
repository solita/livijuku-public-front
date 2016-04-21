module.exports = {
  "bundles": {
    "dist/app-build": {
      includes: [
        '[*.js]',
        '*.html!text',
        '*.css!text'
      ],
      excludes: [
        'npm:core-js',
        'github:jspm/nodelibs-process'
      ],
      options: {
        inject: true,
        minify: true,
        depCache: true,
        rev: true
      }
    },
    "dist/aurelia": {
      includes: [
        "aurelia-framework",
        "aurelia-bootstrapper",
        "aurelia-fetch-client",
        "aurelia-loader",
        "aurelia-logging",
        "aurelia-metadata",
        "aurelia-pal",
        "aurelia-path",
        "aurelia-polymer",
        "aurelia-router",
        "aurelia-animator-css",
        "aurelia-templating",
        "aurelia-templating-binding",
        "aurelia-polyfills",
        "aurelia-templating",
        "aurelia-templating-resources",
        "aurelia-templating-router",
        "aurelia-loader-default",
        "aurelia-history-browser",
        "aurelia-logging-console",
        "aurelia-task-queue"
      ],
      "options": {
        inject: true,
        minify: true,
        depCache: false,
        rev: true
      }
    }
  }
};
