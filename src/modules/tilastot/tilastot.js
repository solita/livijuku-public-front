import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';

@inject(EventAggregator, I18N)
export class Tilastot {

  configureRouter(config, router) {
    config.title = 'Tilastot';
    config.map([
      { route: ['', 'ALL'], moduleId: 'modules/tilastot/viranomainen/viranomainen', name: 'ALL', nav: true, title: this.i18n.tr('kaikki'), settings: { viranomainen: 'ALL'} },
      { route: 'KS1', moduleId: 'modules/tilastot/viranomainen/viranomainen', name: 'KS1', nav: true, title: this.i18n.tr('suuret-kaupunkiseudut'), settings: { viranomainen: 'KS1'} },
      { route: 'KS2', moduleId: 'modules/tilastot/viranomainen/viranomainen', name: 'KS2', nav: true, title: this.i18n.tr('keskisuuret-kaupunkiseudut'), settings: { viranomainen: 'KS2'} },
      { route: 'KS3', moduleId: 'modules/tilastot/viranomainen/viranomainen', name: 'KS3', nav: true, title: this.i18n.tr('pienet-kaupunkiseudut'), settings: { viranomainen: 'KS3'} },
      { route: 'ELY', moduleId: 'modules/tilastot/viranomainen/viranomainen', name: 'ELY', nav: true, title: this.i18n.tr('ELY-keskukset'), settings: { viranomainen: 'ELY'} }
    ]);
    this.router = router;
  }

  constructor(eventAggregator, i18n) {
    this.ea = eventAggregator;
    this.i18n = i18n;
  }

  bind() {
    this.subscription = this.ea.subscribe('router:navigation:success', router => {
      this.fragment = router.instruction.config.navModel.relativeHref;
      this.pageTitle = router.instruction.config.title;
    });
  }

  unbind() {
    this.subscription.dispose();
  }

}
