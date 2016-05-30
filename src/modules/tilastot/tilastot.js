import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';

@inject(EventAggregator)
export class Tilastot {

  configureRouter(config, router) {
    config.title = 'Tilastot';
    config.map([
      { route: ['', 'ALL'], moduleId: 'modules/tilastot/viranomainen/viranomainen', name: 'ALL', nav: true, title: 'Kaikki', settings: { viranomainen: 'ALL'} },
      { route: 'KS1', moduleId: 'modules/tilastot/viranomainen/viranomainen', name: 'KS1', nav: true, title: 'Suuret kaupunkiseudut', settings: { viranomainen: 'KS1'} },
      { route: 'KS2', moduleId: 'modules/tilastot/viranomainen/viranomainen', name: 'KS2', nav: true, title: 'Keskisuuret kaupunkiseudut', settings: { viranomainen: 'KS2'} },
      { route: 'KS3', moduleId: 'modules/tilastot/viranomainen/viranomainen', name: 'KS3', nav: true, title: 'Pienet kaupunkiseudut', settings: { viranomainen: 'KS3'} },
      { route: 'ELY', moduleId: 'modules/tilastot/viranomainen/viranomainen', name: 'ELY', nav: true, title: 'ELY-keskukset', settings: { viranomainen: 'ELY'} }
    ]);
    this.router = router;
  }

  constructor(eventAggregator) {
    this.ea = eventAggregator;
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
