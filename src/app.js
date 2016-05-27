import {inject} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';

@inject(I18N)
export class App {

  constructor(i18n) {
    this.i18n = i18n;
  }

  configureRouter(config, router) {
    config.title = 'JUKU';
    config.map([
      { route: ['', 'etusivu'], moduleId: 'modules/etusivu/etusivu', name: 'etusivu', nav: false, title: this.i18n.tr('etusivu') },
      { route: 'tilastot/valtionavustukset', moduleId: 'modules/tilastot/tilastot', name: 'valtionavustukset', nav: true, title: this.i18n.tr('valtionavustukset') },
      { route: 'tilastot/perus', moduleId: 'modules/tilastot/tilastot', name: 'perus', nav: true, title: this.i18n.tr('perustunnusluvut') },
      { route: 'tilastot/kaikki', moduleId: 'modules/tilastot/tilastot', name: 'kaikki', nav: true, title: this.i18n.tr('kaikki-tunnusluvut') },
      { route: 'kilpailutukset', moduleId: 'modules/kilpailutukset/kilpailutukset', name: 'kilpailutukset', nav: true, title: this.i18n.tr('kilpailutukset') },
      { route: 'kilpailutukset/:id', moduleId: 'modules/kilpailutus/kilpailutus', name: 'kilpailutus', nav: false, title: this.i18n.tr('kilpailutus') }
    ]);
    this.router = router;
  }

  onPanelItemClick() {
    document.querySelector('#panel').togglePanel();
    return true;
  }
}
