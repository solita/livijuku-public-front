export class App {

  configureRouter(config, router) {
    config.title = 'JUKU';
    config.map([
      { route: ['', 'etusivu'], moduleId: 'resources/elements/etusivu/etusivu', name: 'etusivu', nav: false, title: 'etusivu' },
      { route: 'tilastot/valtionavustukset', moduleId: 'resources/elements/tilastot/tilastot', name: 'valtionavustukset', nav: true, title: 'valtionavustukset' },
      { route: 'tilastot/perus', moduleId: 'resources/elements/tilastot/tilastot', name: 'perus', nav: true, title: 'perustunnusluvut' },
      { route: 'tilastot/kaikki', moduleId: 'resources/elements/tilastot/tilastot', name: 'kaikki', nav: true, title: 'kaikki-tunnusluvut' },
      { route: 'kilpailutukset', moduleId: 'resources/elements/kilpailutukset/kilpailutukset', name: 'kilpailutukset', nav: true, title: 'kilpailutukset' },
      { route: 'kilpailutus/:id', moduleId: 'resources/elements/kilpailutus/kilpailutus', name: 'kilpailutus', nav: false, title: 'kilpailutus' }
    ]);
    this.router = router;
  }

  constructor() {
    this.isMenuOpen = false;
    this.isScrollingUp = false;
    this.lastScrollTop = 0;
  }

  attached() {
    let self = this;
    $(window).scroll(function() {
      let scrollTop = $(this).scrollTop();
      self.isScrollingUp = scrollTop < self.lastScrollTop;
      self.lastScrollTop = scrollTop;
    });
  }

  closeMenu() {
    this.isMenuOpen = false;
    return true;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
