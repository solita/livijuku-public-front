import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class Etusivu {
  heading = 'JUKU';

  constructor(router) {
    this.router = router;
  }

  toExtranet() {
    this.router.navigate('http://extranet.liikennevirasto.fi/juku/');
  }
}
