export class App {

  configureRouter(config, router) {
    config.title = 'JUKU';
    config.map([
      { route: ['', 'etusivu'], moduleId: 'modules/etusivu/etusivu', name: 'etusivu', nav: false, title: 'etusivu' },
      { route: 'tilastot/valtionavustukset', moduleId: 'modules/tilastot/tilastot', name: 'valtionavustukset', nav: true, title: 'valtionavustukset' },
      { route: 'tilastot/perus', moduleId: 'modules/tilastot/tilastot', name: 'perus', nav: true, title: 'perustunnusluvut' },
      { route: 'tilastot/kaikki', moduleId: 'modules/tilastot/tilastot', name: 'kaikki', nav: true, title: 'kaikki-tunnusluvut' },
      { route: 'kilpailutukset', moduleId: 'modules/kilpailutukset/kilpailutukset', name: 'kilpailutukset', nav: true, title: 'kilpailutukset' },
      { route: 'kilpailutukset/:id', moduleId: 'modules/kilpailutus/kilpailutus', name: 'kilpailutus', nav: false, title: 'kilpailutus' }
    ]);
    this.router = router;
  }

  onPanelItemClick() {
    document.querySelector('#panel').togglePanel();
    return true;
  }
}
