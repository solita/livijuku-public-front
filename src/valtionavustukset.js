import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-http-client';
import R from 'ramda';

@inject(EventAggregator, HttpClient)
export class Valtionavustukset {

  constructor(EventAggregator, HttpClient) {
    this.ea = EventAggregator;
    this.http = HttpClient;
    this.childRoute = "ALL";
  }

  attached() {
    this.ea.subscribe('router:navigation:success', router => {
      this.childRoute = router.instruction.params.childRoute;
    });
  }

}
