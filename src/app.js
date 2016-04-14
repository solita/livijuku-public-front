export class App {
  configureRouter(config, router) {
    config.title = 'JUKU';
    config.map([
      { route: ['', 'etusivu'],   name: 'etusivu',        moduleId: 'etusivu',        nav: true, title: 'Etusivu' },
      { route: 'tilastot',        name: 'tilastot',       moduleId: 'tilastot',       nav: true, title: 'Tilastot' },
      { route: 'tilastot/valtionavustukset',  name: 'valtionavustukset', moduleId: 'valtionavustukset', nav: false, title: 'Valtionavustukset' },
      { route: 'tilastot/perustunnusluvut',  name: 'perustunnusluvut', moduleId: 'perustunnusluvut', nav: false, title: 'Perustunnusluvut' },
      { route: 'tilastot/kaikkiTunnusluvut',  name: 'kaikkiTunnusluvut', moduleId: 'kaikkiTunnusluvut', nav: false, title: 'Kaikki tunnusluvut' },
      { route: 'kilpailutukset',  name: 'kilpailutukset', moduleId: 'kilpailutukset', nav: true, title: 'Kilpailutukset' }

    ]);

    this.router = router;
  }
}
