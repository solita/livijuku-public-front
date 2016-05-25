export class App {
  configureRouter(config, router) {
    config.title = 'JUKU';
    config.map([
      { route: ['', 'etusivu'], moduleId: 'modules/etusivu/etusivu', name: 'etusivu', nav: false, title: 'Etusivu' },
      { route: 'tilastot/valtionavustukset', moduleId: 'modules/tilastot/valtionavustukset/valtionavustukset', name: 'valtionavustukset', nav: true, title: 'Valtionavustukset' },
      { route: 'tilastot/perus', moduleId: 'modules/tilastot/perustunnusluvut/perustunnusluvut', name: 'perustunnusluvut', nav: true, title: 'Perustunnusluvut' },
      { route: 'tilastot/kaikki', moduleId: 'modules/tilastot/kaikki-tunnusluvut/kaikki-tunnusluvut', name: 'kaikkiTunnusluvut', nav: true, title: 'Kaikki tunnusluvut' },
      { route: 'kilpailutukset', moduleId: 'modules/kilpailutukset/kilpailutukset', name: 'kilpailutukset', nav: true, title: 'Kilpailutukset' },
      { route: 'kilpailutukset/:id', moduleId: 'modules/kilpailutus/kilpailutus', name: 'kilpailutus', nav: false, title: 'Kilpailutus' }
    ]);
    this.router = router;
  }

  onPanelItemClick() {
    document.querySelector('#panel').togglePanel();
    return true;
  }
}
