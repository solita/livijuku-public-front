import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class Api {

  constructor(http) {
    this.http = http;
  }

  get kilpailutukset() {
    return this.http.fetch('api/kilpailutukset').then(response => response.json());
  }

  get organisaatiot() {
    return this.http.fetch('api/organisaatiot').then(response => response.json());
  }

  getAvustukset(viranomainen) {
    return this.http.fetch('api/avustus/' + viranomainen).then(response => response.json());
  }

  getAvustuksetOrganisaatioittain(viranomainen) {
    return this.http.fetch('api/avustus-details/' + viranomainen).then(response => response.json());
  }

  getAvustusPerAsukas(viranomainen) {
    return this.http.fetch('api/avustus-asukas/' + viranomainen).then(response => response.json());
  }

  getKilpailutus(id) {
    return this.http.fetch('api/kilpailutus/' + id).then(response => response.json());
  }

  getTyytyvaisyysJoukkoliikenteeseen(viranomainen) {
    return this.http.fetch('api/tilastot/alue-asiakastyytyvaisyys/' + viranomainen + '?group-by=organisaatioid&group-by=vuosi').then(response => response.json());
  }

  getMatkustajamaarat(viranomainen) {
    return this.http.fetch('api/tilastot/nousut/' + viranomainen + '?group-by=organisaatioid&group-by=vuosi').then(response => response.json());
  }

  getLahtojenMaara(viranomainen) {
    return this.http.fetch('api/tilastot/lahdot/' + viranomainen + '?group-by=organisaatioid&group-by=vuosi').then(response => response.json());
  }

  getLinjakilometrit(viranomainen) {
    return this.http.fetch('api/tilastot/linjakilometrit/' + viranomainen + '?group-by=organisaatioid&group-by=vuosi').then(response => response.json());
  }

  getValtionRahoitusAsukastaKohden(viranomainen) {
    return this.http.fetch('api/avustus-asukas/' + viranomainen).then(response => response.json());
  }

  getToimivaltaisenViranomaisenOmarahoitusAsukastaKohden(viranomainen) {
    return this.http.fetch('api/omarahoitus-asukas/' + viranomainen).then(response => response.json());
  }

  getPsaLiikenteenNettokustannukset(viranomainen) {
    return this.http.fetch('api/psa-nettokustannus/' + viranomainen).then(response => response.json());
  }

}
