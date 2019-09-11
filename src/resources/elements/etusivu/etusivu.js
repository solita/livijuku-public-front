import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from 'resources/services/api';

@inject(Router, Api)
export class Etusivu {
  heading = 'JUKU';

  constructor(router, api) {
    this.router = router;
    this.api = api;
  }

  toExtranet() {
    this.api.getConfig().then(config => this.router.navigate(config.authorityURL));
  }
}
