import {Api} from 'services/api';
import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import R from 'ramda';
import Moment from 'moment';
import 'moment/locale/fi';

@inject(Api, HttpClient)
export class Kilpailutus {

  constructor(api, http) {
    this.api = api;
    this.http = http;
  }

  activate(params) {
    return this.api.organisaatiot.then(organisaatiot => {
      this.organisaatiot = organisaatiot;
      this.api.getKilpailutus(params.id).then(data => {
        this.kilpailutus = data;
        this.kilpailutus.organisaatio = R.find(R.propEq('id', this.kilpailutus.id), this.organisaatiot);
        this.kilpailutus.julkaisupvm = Moment(this.kilpailutus.julkaisupvm).format('dd DD.MM.YYYY');
        this.kilpailutus.tarjouspaattymispvm = Moment(this.kilpailutus.tarjouspaattymispvm).format('dd DD.MM.YYYY');
        this.kilpailutus.hankintapaatospvm = Moment(this.kilpailutus.hankintapaatospvm).format('dd DD.MM.YYYY');
        this.kilpailutus.liikennointialoituspvm = Moment(this.kilpailutus.liikennointialoituspvm).format('dd DD.MM.YYYY');
        this.kilpailutus.liikennointipaattymispvm = Moment(this.kilpailutus.liikennointipaattymispvm).format('dd DD.MM.YYYY');
        this.kilpailutus.hankittuoptiopaattymispvm = Moment(this.kilpailutus.hankittuoptiopaattymispvm).format('dd DD.MM.YYYY');
        this.kilpailutus.optiopaattymispvm = Moment(this.kilpailutus.optiopaattymispvm).format('dd DD.MM.YYYY');
      });
    });
  }
}
