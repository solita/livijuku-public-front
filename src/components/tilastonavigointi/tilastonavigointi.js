import {bindable, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-http-client';
import {Router} from 'aurelia-router';
import R from 'ramda';
import MobileDetect from 'mobile-detect';

@inject(EventAggregator, HttpClient, Router)
export class TilastonavigointiCustomElement {

  @bindable page;

  constructor(eventAggregator, http, router) {
    this.ea = eventAggregator;
    this.http = http;
    this.router = router;
    this.md = new MobileDetect(window.navigator.userAgent);
    this.viranomaiset = [{
      id: 'ALL',
      nimi: 'Kaikki'
    }, {
      id: 'KS1',
      nimi: 'Suuret kaupungit'
    }, {
      id: 'KS2',
      nimi: 'Keskisuuret kaupungit'
    }, {
      id: 'KS3',
      nimi: 'Pienet kaupungit'
    }, {
      id: 'ELY',
      nimi: 'ELY-keskukset'
    }];
  }

  attached() {
    this.ea.subscribe('router:navigation:success', router => {
      if (router.instruction.fragment.indexOf(this.page) !== -1) {
        this.childRoute = router.instruction.params.childRoute;
        this.childRouteIndex = this.getChildRouteIndex();
        if (this.childRouteIndex === -1) {
          if (this.md.mobile()) {
            this.router.navigate(this.page + '/KS1');
          } else {
            this.router.navigate(this.page + '/ALL');
          }
        }
      }
    });
  }

  getChildRouteIndex() {
    return R.findIndex(R.propEq('id', this.childRoute))(this.viranomaiset);
  }

}
