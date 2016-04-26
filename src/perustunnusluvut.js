import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-http-client';
import {Router} from 'aurelia-router';
import R from 'ramda';

@inject(EventAggregator, HttpClient, Router)
export class Perustunnusluvut {

  constructor(EventAggregator, HttpClient, router) {
    this.ea = EventAggregator;
    this.http = HttpClient;
    this.router = router;
  }

  attached() {
    this.ea.subscribe('router:navigation:success', router => {
      this.childRoute = router.instruction.params.childRoute;
    });
    this.childRoute = this.router.currentInstruction.params.childRoute;
  }

}
