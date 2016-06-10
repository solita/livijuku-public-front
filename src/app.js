import $ from 'jquery';

export class App {

  configureRouter(config, router) {
    config.title = 'JUKU';
    config.addPipelineStep('postcomplete', PostCompleteStep);
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

class PostCompleteStep {
  run(routingContext, next) {
    $('body').scrollTop(0);
    return next();
  }
}
