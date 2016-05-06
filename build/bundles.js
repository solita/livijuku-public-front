module.exports = {
  "bundles": {
    "dist/app-build": {
      includes: [
        '[*.js]',
        '*.html!text',
        '**/*.css!text'
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
        "aurelia-animator-css",
        "aurelia-framework",
        "aurelia-bootstrapper",
        "aurelia-fetch-client",
        "aurelia-history-browser",
        "aurelia-html-import-template-loader",
        "aurelia-loader",
        "aurelia-loader-default",
        "aurelia-logging",
        "aurelia-logging-console",
        "aurelia-metadata",
        "aurelia-pal",
        "aurelia-path",
        "aurelia-polyfills",
        "aurelia-polymer",
        "aurelia-router",
        "aurelia-task-queue",
        "aurelia-templating",
        "aurelia-templating",
        "aurelia-templating-binding",
        "aurelia-templating-resources",
        "aurelia-templating-router",
        "i18next",
        "i18next-xhr-backend",
        "aurelia-i18n",
        "aurelia-cookie"
      ],
      "options": {
        inject: true,
        minify: true,
        depCache: false,
        rev: true
      }
    },
    "dist/view-bundle": {
      htmlimport: true,
      includes: 'dist/*.html',
      options: {
        inject: {
          indexFile : 'index.html',
          destFile : 'dest_index.html'
        }
      }
    }
  }
};
