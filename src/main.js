import {EventManager} from 'aurelia-framework';
import XHR from 'i18next-xhr-backend';

export function configure(aurelia) {
  let eventManager = aurelia.container.get(EventManager);
  eventManager.registerElementConfig({
    tagName: 'paper-toggle-button',
    properties: {
      checked: ['change']
    }
  });

  aurelia.use
    .standardConfiguration();
    // .developmentLogging();

  aurelia.use.plugin('aurelia-i18n', (instance) => {
    // register backend plugin
    instance.i18next.use(XHR);

    // adapt options to your needs (see http://i18next.com/docs/options/)
    instance.setup({
      backend: {
        loadPath: 'locale/{{lng}}/{{ns}}.json'
      },
      lng: 'fi',
      attributes: ['t', 'i18n'],
      fallbackLng: 'en',
      debug: false
    });
  });

  //Uncomment the line below to enable animation.
  aurelia.use.plugin('aurelia-animator-css');
  //if the css animator is enabled, add swap-order="after" to all router-view elements

  aurelia.use.plugin('aurelia-polymer');
  //Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  aurelia.use.plugin('aurelia-html-import-template-loader');

  aurelia.use.plugin('aurelia-cookie');

  aurelia.start().then(() => aurelia.setRoot());
}
