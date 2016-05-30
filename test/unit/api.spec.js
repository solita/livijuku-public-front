import {Api} from '../../src/services/api';

class HttpStub {
  fetch(url) {
    var response = this.itemStub;
    this.url = url;
    return new Promise((resolve) => {
      resolve({ json: () => response });
    });
  }

  configure(func) {
  }
}

describe('Api', () => {
  let sut;
  let http;

  beforeEach(() => {
    http = new HttpStub();
    sut = new Api(http);
  });

  it('provides kilpailutukset', () => {
    expect(sut.kilpailutukset).toBeDefined();
    expect(http.url).toEqual('api/kilpailutukset');
  });

  it('provides organisations', () => {
    expect(sut.organisaatiot).toBeDefined();
    expect(http.url).toEqual('api/organisaatiot');
  });

  it('provides avustukset by viranomainen', () => {
    expect(sut.getAvustukset).toBeDefined();
    let result = sut.getAvustukset('ALL');
    expect(http.url).toEqual('api/avustus/ALL');
  });

  it('provides avustukset organisaatioittain', () => {
    expect(sut.getAvustuksetOrganisaatioittain).toBeDefined();
    let result = sut.getAvustuksetOrganisaatioittain('KS1');
    expect(http.url).toEqual('api/avustus-details/KS1');
  });

  it('provides avustus per asukas', () => {
    expect(sut.getAvustusPerAsukas).toBeDefined();
    let result = sut.getAvustusPerAsukas('KS2');
    expect(http.url).toEqual('api/avustus-asukas/KS2');
  });

  it('provides tyytyväisyys joukkoliikenteeseen', () => {
    expect(sut.getTyytyvaisyysJoukkoliikenteeseen).toBeDefined();
    let result = sut.getTyytyvaisyysJoukkoliikenteeseen('KS3');
    expect(http.url).toEqual('api/tilastot/alue-asiakastyytyvaisyys/KS3?group-by=organisaatioid&group-by=vuosi');
  });

  it('provides tyytyväisyys joukkoliikenteeseen', () => {
    expect(sut.getMatkustajamaarat).toBeDefined();
    let result = sut.getMatkustajamaarat('ELY');
    expect(http.url).toEqual('api/tilastot/nousut/ELY?group-by=organisaatioid&group-by=vuosi');
  });

  it('provides lähtöjen määrä', () => {
    expect(sut.getLahtojenMaara).toBeDefined();
    let result = sut.getLahtojenMaara('ALL');
    expect(http.url).toEqual('api/tilastot/lahdot/ALL?group-by=organisaatioid&group-by=vuosi');
  });

  it('provides linjakilometrit', () => {
    expect(sut.getLinjakilometrit).toBeDefined();
    let result = sut.getLinjakilometrit('KS1');
    expect(http.url).toEqual('api/tilastot/linjakilometrit/KS1?group-by=organisaatioid&group-by=vuosi');
  });

  it('provides valtionrahoitus asukasta kohden', () => {
    expect(sut.getValtionRahoitusAsukastaKohden).toBeDefined();
    let result = sut.getValtionRahoitusAsukastaKohden('KS2');
    expect(http.url).toEqual('api/avustus-asukas/KS2');
  });

  it('provides valtionrahoitus asukasta kohden', () => {
    expect(sut.getToimivaltaisenViranomaisenOmarahoitusAsukastaKohden).toBeDefined();
    let result = sut.getToimivaltaisenViranomaisenOmarahoitusAsukastaKohden('KS3');
    expect(http.url).toEqual('api/omarahoitus-asukas/KS3');
  });

  it('provides valtionrahoitus asukasta kohden', () => {
    expect(sut.getPsaLiikenteenNettokustannukset).toBeDefined();
    let result = sut.getPsaLiikenteenNettokustannukset('ELY');
    expect(http.url).toEqual('api/psa-nettokustannus/ELY');
  });

});
