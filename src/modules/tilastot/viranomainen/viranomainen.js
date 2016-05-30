import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(EventAggregator, Router)
export class Viranomainen {

  constructor(eventAggregator, router) {
    this.ea = eventAggregator;
    this.router = router;
    this.viranomainen = null;
  }

  bind() {
    this.subscription = this.ea.subscribe('router:navigation:success', router => {
      this.viranomainen = router.instruction.params.childRoute || 'ALL';
      this.tunnuslukuPageUrl = `modules/tilastot/${router.instruction.config.name}/${router.instruction.config.name}`;
    });
  }

  unbind() {
    this.subscription.dispose();
  }
}
