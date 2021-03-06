import {Api} from 'resources/services/api';
import {inject} from 'aurelia-framework';
import R from 'ramda';
import moment from 'moment';

@inject(Api)
export class Kilpailutus {

  constructor(api) {
    this.api = api;
  }

  activate(params) {
    return this.api.organisaatiot.then(organisaatiot => {
      this.organisaatiot = organisaatiot;
      this.api.getKilpailutus(params.id).then(data => {
        this.kilpailutus = data;
        this.kilpailutus.organisaatio = R.find(R.propEq('id', this.kilpailutus.id), this.organisaatiot);
        this.kilpailutus.julkaisupvm = R.isNil(this.kilpailutus.julkaisupvm) ? '-' : moment(this.kilpailutus.julkaisupvm).format('DD.MM.YYYY');
        this.kilpailutus.tarjouspaattymispvm = R.isNil(this.kilpailutus.tarjouspaattymispvm) ? '-' : moment(this.kilpailutus.tarjouspaattymispvm).format('DD.MM.YYYY');
        this.kilpailutus.hankintapaatospvm = R.isNil(this.kilpailutus.hankintapaatospvm) ? '-' : moment(this.kilpailutus.hankintapaatospvm).format('DD.MM.YYYY');
        this.kilpailutus.liikennointialoituspvm = R.isNil(this.kilpailutus.liikennointialoituspvm) ? '-' : moment(this.kilpailutus.liikennointialoituspvm).format('DD.MM.YYYY');
        this.kilpailutus.liikennointipaattymispvm = R.isNil(this.kilpailutus.liikennointipaattymispvm) ? '-' : moment(this.kilpailutus.liikennointipaattymispvm).format('DD.MM.YYYY');
        this.kilpailutus.hankittuoptiopaattymispvm = R.isNil(this.kilpailutus.hankittuoptiopaattymispvm) ? '-' : moment(this.kilpailutus.hankittuoptiopaattymispvm).format('DD.MM.YYYY');
        this.kilpailutus.optiopaattymispvm = R.isNil(this.kilpailutus.optiopaattymispvm) ? '-' : moment(this.kilpailutus.optiopaattymispvm).format('DD.MM.YYYY');
      });
    });
  }

  backToKilpailutuksetView() {
    history.back();
  }
}
