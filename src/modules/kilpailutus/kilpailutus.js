import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';

@inject(HttpClient)
export class Kilpailutus {

  constructor(http) {
    this.http = http;
  }

  activate(params) {
    return this.http.fetch('kilpailutus/' + params.id)
      .then(response => response.json())
      .then(data => {
        this.kilpailutus = data;
      });
  }
}
