import {Api} from 'services/api';
import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import R from 'ramda';
import moment from 'moment';
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
        this.kilpailutus.julkaisupvm = R.isNil(this.kilpailutus.julkaisupvm) ? '-' : moment(this.kilpailutus.julkaisupvm).format('dd DD.MM.YYYY');
        this.kilpailutus.tarjouspaattymispvm = R.isNil(this.kilpailutus.tarjouspaattymispvm) ? '-' : moment(this.kilpailutus.tarjouspaattymispvm).format('dd DD.MM.YYYY');
        this.kilpailutus.hankintapaatospvm = R.isNil(this.kilpailutus.hankintapaatospvm) ? '-' : moment(this.kilpailutus.hankintapaatospvm).format('dd DD.MM.YYYY');
        this.kilpailutus.liikennointialoituspvm = R.isNil(this.kilpailutus.liikennointialoituspvm) ? '-' : moment(this.kilpailutus.liikennointialoituspvm).format('dd DD.MM.YYYY');
        this.kilpailutus.liikennointipaattymispvm = R.isNil(this.kilpailutus.liikennointipaattymispvm) ? '-' : moment(this.kilpailutus.liikennointipaattymispvm).format('dd DD.MM.YYYY');
        this.kilpailutus.hankittuoptiopaattymispvm = R.isNil(this.kilpailutus.hankittuoptiopaattymispvm) ? '-' : moment(this.kilpailutus.hankittuoptiopaattymispvm).format('dd DD.MM.YYYY');
        this.kilpailutus.optiopaattymispvm = R.isNil(this.kilpailutus.optiopaattymispvm) ? '-' : moment(this.kilpailutus.optiopaattymispvm).format('dd DD.MM.YYYY');
      });
    });
  }
}
