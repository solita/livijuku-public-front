import {bindable, inject} from 'aurelia-framework';
import {Cookie} from 'aurelia-cookie';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import R from 'ramda';
import 'fetch';

@inject(EventAggregator, HttpClient, Router)
export class Valtionavustukset {

  constructor(EventAggregator, HttpClient, router) {
    console.info(HttpClient);
    this.ea = EventAggregator;
    HttpClient.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl('api/');
        // .withInterceptor({
        //     request: function (request) {
        //       request.headers.set('XSRF-TOKEN', myAwesomeToken);
        //       return request;
        //     }
        // });
    });
    this.http = HttpClient;
    this.router = router;
  }

  attached() {
    console.info(Cookie);
    this.ea.subscribe('router:navigation:success', router => {
      this.childRoute = router.instruction.params.childRoute;
      this.http.fetch('avustus-asukas/ALL')
        .then(response => response.json())
        .then(data => {
          this.data = data;
          console.info(this.data);
        });
          // response.content.forEach(value => {
          //   console.info(value);
          // });
          // let data = R.map(item => {
          //   console.info(item);
          //   return {
          //     key:
          //   };
          // }, this.avustusAsukasALL);
          // console.info(this.avustusAsukasALL, data);
        // })
    });
    this.childRoute = this.router.currentInstruction.params.childRoute;
  }

}
