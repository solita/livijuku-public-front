import {inject} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import {DialogService} from 'aurelia-dialog';
import {NotificationOfIncompleteInformation} from 'resources/elements/notification-of-incomplete-information';

@inject(DialogService, I18N)
export class App {

  configureRouter(config, router) {
    config.title = 'JUKU';
    config.map([
      { route: ['', 'etusivu'], moduleId: 'resources/elements/etusivu/etusivu', name: 'etusivu', nav: false, title: 'etusivu' },
      { route: 'tilastot/valtionavustukset', moduleId: 'resources/elements/tilastot/tilastot', name: 'valtionavustukset', nav: true, title: this.i18n.tr('valtionavustukset') },
      { route: 'tilastot/perus', moduleId: 'resources/elements/tilastot/tilastot', name: 'perus', nav: true, title: this.i18n.tr('perustunnusluvut') },
      { route: 'tilastot/kaikki', moduleId: 'resources/elements/tilastot/tilastot', name: 'kaikki', nav: true, title: this.i18n.tr('kaikki-tunnusluvut') },
      { route: 'kilpailutukset', moduleId: 'resources/elements/kilpailutukset/kilpailutukset', name: 'kilpailutukset', nav: true, title: this.i18n.tr('kilpailutukset') },
      { route: 'kilpailutus/:id', moduleId: 'resources/elements/kilpailutus/kilpailutus', name: 'kilpailutus', nav: false, title: this.i18n.tr('kilpailutus') }
    ]);
    this.router = router;
  }

  constructor(dialogService, i18n) {
    this.dialogService = dialogService;
    this.i18n = i18n;
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
    this.dialogService.open({
      viewModel: NotificationOfIncompleteInformation,
      model: {}
    }).then(response => {});
  }

  closeMenu() {
    this.isMenuOpen = false;
    return true;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
