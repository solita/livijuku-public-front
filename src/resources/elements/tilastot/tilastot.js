import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import R from 'ramda';

@inject(EventAggregator, I18N)
export class Tilastot {

  constructor(eventAggregator, i18n) {
    this.ea = eventAggregator;
    this.i18n = i18n;
    this.isMobile = document.body.clientWidth < 768;
  }

  configureRouter(config, router) {
    config.title = 'Tilastot';
    let routeifs = this.isMobile ? [
      { route: ['', 'KS1'], moduleId: 'resources/elements/tilastot/viranomainen/viranomainen', name: 'KS1', nav: true, title: 'suuret-kaupunkiseudut', settings: { viranomainen: 'KS1'} }
    ] : [
      { route: ['', 'ALL'], moduleId: 'resources/elements/tilastot/viranomainen/viranomainen', name: 'ALL', nav: true, title: 'kaikki', settings: { viranomainen: 'ALL'} },
      { route: 'KS1', moduleId: 'resources/elements/tilastot/viranomainen/viranomainen', name: 'KS1', nav: true, title: 'suuret-kaupunkiseudut', settings: { viranomainen: 'KS1'} }
    ];
    let routes = R.concat(routeifs, [{
      route: 'KS2', moduleId: 'resources/elements/tilastot/viranomainen/viranomainen', name: 'KS2', nav: true, title: 'keskisuuret-kaupunkiseudut', settings: { viranomainen: 'KS2'}
    }, {
      route: 'KS3', moduleId: 'resources/elements/tilastot/viranomainen/viranomainen', name: 'KS3', nav: true, title: 'pienet-kaupunkiseudut', settings: { viranomainen: 'KS3'}
    }, {
      route: ['ELY'], moduleId: 'resources/elements/tilastot/viranomainen/viranomainen', name: 'ELY', nav: true, title: 'ELY-keskukset', settings: { viranomainen: 'ELY'}
    }]);
    config.map(routes);
    this.router = router;
  }

  activate() {
    this.subscription = this.ea.subscribe('router:navigation:success', router => {
      this.initialize();
    });
  }

  initialize() {
    this.pageTitle = this.router.parent.currentInstruction.config.title;
    this.toimivaltaalueet = R.map(alue => { return this.i18n.tr(alue.title); }, this.router.navigation);
    this.fragment = this.router.currentInstruction.fragment || (this.isMobile ? 'KS1' : 'ALL');
    this.childRouteIndex = R.findIndex(R.propEq('relativeHref', this.router.currentInstruction.fragment))(this.router.navigation) || 0;
  }

  selectToimivaltaalue() {
    this.router.navigate(this.router.navigation[this.childRouteIndex].href);
  }

}
