export class App {
  configureRouter(config, router) {
    config.title = 'JUKU';
    config.map([
      { route: ['', 'etusivu'],   name: 'etusivu',  moduleId: 'etusivu',  nav: false, title: 'Etusivu' },
      { route: 'valtionavustukset',  name: 'valtionavustukset',  moduleId: 'valtionavustukset', nav: true, title: 'Valtionavustukset' },
      { route: 'perustunnusluvut',   name: 'perustunnusluvut',   moduleId: 'perustunnusluvut',  nav: true, title: 'Perustunnusluvut' },
      { route: 'kaikkiTunnusluvut',  name: 'kaikkiTunnusluvut',  moduleId: 'kaikkiTunnusluvut', nav: true, title: 'Kaikki tunnusluvut' },
      { route: 'kilpailutukset',  name: 'kilpailutukset', moduleId: 'kilpailutukset', nav: true, title: 'Kilpailutukset' },
      { route: 'kilpailutukset/:id',  name: 'kilpailutus', moduleId: 'kilpailutus', nav: false, title: 'Kilpailutus' }
    ]);
    this.router = router;
  }
}
