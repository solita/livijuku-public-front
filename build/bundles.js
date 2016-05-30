module.exports = {
  "bundles": {
    "dist/app-build": {
      includes: [
        '[*.js]',
        '*.html!text',
        '**/*.css!text',
        '[*/**/*.js]',
        '*/**/*.html!text',
        '*/**/*.css!text'
      ],
      options: {
        inject: true,
        minify: true,
        depCache: false,
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
        "text",
        "fetch",
        "intl"
      ],
      "options": {
        inject: true,
        minify: true,
        depCache: false,
        rev: false
      }
    },
    "dist/vendor": {
      includes: [
        "jquery",
        "lodash",
        "ramda",
        "wnumb",
        "leongersen/noUiSlider",
        "select2",
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
