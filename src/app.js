export class App {
  configureRouter(config, router) {
    config.title = 'JUKU';
    config.map([
      { route: ['', 'etusivu'],   name: 'etusivu',  moduleId: 'etusivu',  nav: false, title: 'Etusivu' },
      { route: 'valtionavustukset',  name: 'valtionavustukset',  moduleId: 'valtionavustukset', nav: true, title: 'Valtionavustukset' },
      { route: 'perustunnusluvut',   name: 'perustunnusluvut',   moduleId: 'perustunnusluvut',  nav: true, title: 'Perustunnusluvut' },
      { route: 'kaikkitunnusluvut',  name: 'kaikkiTunnusluvut',  moduleId: 'kaikkiTunnusluvut', nav: true, title: 'Kaikki tunnusluvut' },
      { route: 'kilpailutukset',  name: 'kilpailutukset', moduleId: 'kilpailutukset', nav: true, title: 'Kilpailutukset' }
    ]);
    this.router = router;
  }
}
