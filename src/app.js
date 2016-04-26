export class App {
  configureRouter(config, router) {
    config.title = 'JUKU';
    config.map([
      { route: ['', 'etusivu'],   name: 'etusivu',  moduleId: 'etusivu',  nav: false, title: 'Etusivu' },
      { route: 'tilastot',        name: 'tilastot', moduleId: 'tilastot', nav: false,  title: 'Tilastot' },
      { route: 'tilastot/valtionavustukset',  name: 'valtionavustukset',  moduleId: 'valtionavustukset', nav: true, title: 'Valtionavustukset' },
      { route: 'tilastot/perustunnusluvut',   name: 'perustunnusluvut',   moduleId: 'perustunnusluvut',  nav: true, title: 'Perustunnusluvut' },
      { route: 'tilastot/kaikkitunnusluvut',  name: 'kaikkitunnusluvut',  moduleId: 'kaikkitunnusluvut', nav: true, title: 'Kaikki tunnusluvut' },
      { route: 'kilpailutukset',  name: 'kilpailutukset', moduleId: 'kilpailutukset', nav: true, title: 'Kilpailutukset' }
    ]);
    this.router = router;
  }
}
