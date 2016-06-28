import environment from './environment';
import {EventManager} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import {RelativeTime} from 'aurelia-i18n';
import XHR from 'i18next-xhr-backend';

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
Promise.config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia) {
  let eventManager = aurelia.container.get(EventManager);
  eventManager.registerElementConfig({
    tagName: 'paper-toggle-button',
    properties: {
      checked: ['change']
    }
  })

  aurelia.use
    .standardConfiguration()
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.use.plugin('aurelia-i18n', (instance) => {
    // register backend plugin
    instance.i18next.use(XHR);

    // adapt options to your needs (see http://i18next.com/docs/options/)
    return instance.setup({
      backend: {
        loadPath: 'locales/{{lng}}/{{ns}}.json'
      },
      lng: 'fi',
      attributes: ['t', 'i18n'],
      fallbackLng: 'en',
      debug: false
    });
  });

  aurelia.start().then(() => aurelia.setRoot());
}
