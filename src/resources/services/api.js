import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class Api {

  constructor(http) {
    let self = this;
    this.http = http;
    console.info(this.http);
    this.http.configure(config => {
      config
        .withBaseUrl('api/')
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withInterceptor({
          request(request) {
            self.isLoading = true;
            request.headers.set('x-xsrf-token', 'guest');
            return request;
          },
          response(response) {
            self.isLoading = false;
            return response.json();
          }
        });
    });
  }

  fetchDataForChart(url) {
    return this.http.fetch(url);
  }

  get kilpailutukset() {
    return this.http.fetch('kilpailutukset');
  }

  get organisaatiot() {
    return this.http.fetch('organisaatiot');
  }

  getAvustukset(viranomainen) {
    return this.http.fetch('avustus/' + viranomainen);
  }

  getAvustuksetOrganisaatioittain(viranomainen) {
    return this.http.fetch('avustus-details/' + viranomainen);
  }

  getAvustusPerAsukas(viranomainen) {
    return this.http.fetch('avustus-asukas/' + viranomainen);
  }

  getKilpailutus(id) {
    return this.http.fetch('kilpailutus/' + id);
  }

  getTyytyvaisyysJoukkoliikenteeseen(viranomainen) {
    return this.http.fetch('tilastot/alue-asiakastyytyvaisyys/' + viranomainen + '?group-by=organisaatioid&group-by=vuosi');
  }

  getMatkustajamaarat(viranomainen) {
    return this.http.fetch('tilastot/nousut/' + viranomainen + '?group-by=organisaatioid&group-by=vuosi');
  }

  getLahtojenMaara(viranomainen) {
    return this.http.fetch('tilastot/lahdot/' + viranomainen + '?group-by=organisaatioid&group-by=vuosi');
  }

  getLinjakilometrit(viranomainen) {
    return this.http.fetch('tilastot/linjakilometrit/' + viranomainen + '?group-by=organisaatioid&group-by=vuosi');
  }

  getValtionRahoitusAsukastaKohden(viranomainen) {
    return this.http.fetch('avustus-asukas/' + viranomainen);
  }

  getToimivaltaisenViranomaisenOmarahoitusAsukastaKohden(viranomainen) {
    return this.http.fetch('omarahoitus-asukas/' + viranomainen);
  }

  getPsaLiikenteenNettokustannukset(viranomainen) {
    return this.http.fetch('psa-nettokustannus/' + viranomainen);
  }

}
