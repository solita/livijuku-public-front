import _ from 'lodash';
import * as c from 'utils/core';
import R from 'ramda';

export function isSopimustyyppi(tunnuslukutyyppi) {
  return _.includes(['BR', 'KOS', 'SA', 'ME'], tunnuslukutyyppi);
}

export function isLipputuloSopimustyyppi(tunnuslukutyyppi) {
  return _.includes(['BR', 'KOS', 'SA'], tunnuslukutyyppi);
}

export function isPSA(tunnuslukutyyppi) {
  return _.includes(['BR', 'KOS'], tunnuslukutyyppi);
}

export const viikonpaivaluokat = ['A', 'LA', 'SU'];

export const paastoluokat = ['E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6'];

export const organisaatiolajit = {
  ALL: 'Kaikki organisaatiot',
  KS1: 'Suuret kaupunkiseudut',
  KS2: 'Keskisuuret kaupunkiseudut',
  KS3: 'Pienet kaupunkiseudut',
  ELY: 'ELY-keskukset',
  $order: ['ALL', 'KS1', 'KS2', 'KS3', 'ELY'],
  $nimi: id => organisaatiolajit[id],
  $id: 'organisaatiolajitunnus'
};

export function numberFormat(arvo) {
  let result = (arvo % 1) === 0 ? arvo : d3.format('.02f')(arvo);
  if (arvo > 999) result = d3.format('.4s')(arvo);
  return result;
}

export function numberFormatTooltip(arvo) {
  let result = '';
  if (c.isNullOrUndefined(arvo)) {
    result = 'Tietoa ei määritetty';
  } else {
    if ((arvo % 1) === 0) {
      result = d3.format(',')(arvo);
    } else {
      result = d3.format(',.02f')(arvo);
    }
  }
  return result;
}

export function toOrganisaatioSeriesNvd3(data, organisaatiot) {
  let body = _.tail(data);
  let xdimension = _.uniq(_.map(body, r => r[1]));
  let organisaatiorows = _.values(_.groupBy(body, row => row[0]));

  function augmentNullValues(rows) {
    let oganisaatioid = rows[0][0];
    let groupByX = _.mapValues(_.groupBy(rows, row => row[1]), v => _.first(v));
    return _.map(xdimension, x => groupByX[x] ? groupByX[x] : [oganisaatioid, x, null, null]);
  }
  return _.map(organisaatiorows,
    rows => ({
      key: (_.find(organisaatiot, {id: rows[0][0]})).nimi,
      values: augmentNullValues(rows)
    }));
}

export function missingOrganisaatiot(data, allOrganisaatiot, organisaatiolajitunnus) {
  let organisaatiotInData = _.uniq(_.map(_.tail(data), r => r[0]));

  let organisaatiotInLaji = organisaatiolajitunnus === 'ALL' ?
    _.filter(allOrganisaatiot, org => org.lajitunnus !== 'LV') :
    _.filter(allOrganisaatiot, {lajitunnus: organisaatiolajitunnus});

  return _.filter(organisaatiotInLaji, org => !_.includes(organisaatiotInData, org.id));
}

/* Progress bar laskenta */

export function laskeTayttoaste(tunnusluvut, tyyppi) {
  return Math.round(100 * laske(tunnusluvut) / (maksimipisteet[tyyppi] + joukkoliikennetukipisteet(tunnusluvut)));
}

export function laskeTayttoasteType(tunnusluvut, tyyppi) {
  let result = 'danger';
  let tayttoaste = laskeTayttoaste(tunnusluvut, tyyppi);
  if (tayttoaste > 80) result = 'success';
  else if (tayttoaste > 20) result = 'warning';
  return result;
}

export function getGroupKeys(groupIndex, data) {
  return R.sort((a, b) => {
    return a > b;
  }, R.uniq(R.map(item => {
    return item[groupIndex];
  }, R.tail(data))));
}

export function getOrganisaatioNames(groupKeys, organisaatiot) {
  return R.map(key => {
    return R.find(R.propEq('id', key))(organisaatiot).nimi;
  }, groupKeys);
}

const maksimipisteet = {
  TTYT: 17,
  BR: 94,
  KOS: 106,
  SA: 60,
  ME: 48
};

function joukkoliikennetukipisteet(tunnusluvut) {
  return tunnusluvut.joukkoliikennetuki ? 3 : 0;
}

function tyhja(val) {
  return (_.isNaN(val) || _.isNil(val) || (val === ''));
}

function laskeAlue(alue) {
  let annetutArvot = _.omitBy(_.merge(_.omit(alue, ['kustannus', 'kommentti']), alue.kustannus), tyhja);
  return _.size(annetutArvot);
}

function laskeLippuhinta(lippuhinnat) {
  let annetutArvot = _.reject(lippuhinnat, function(n) {
    return (tyhja(n.kausilippuhinta) && tyhja(n.kertalippuhinta));
  });
  let result = 0;
  // Jos yksikin kentta on taytetty, palautetaan 1 piste
  if (_.size(annetutArvot) > 0) result = 1;
  return result;
}

function laskeLiikenteenKysyntaJaTarjonta(arvot) {
  let annetutArvot = _.reject(_.concat(_.map(arvot, 'lahdot'), _.map(arvot, 'linjakilometrit'), _.map(arvot, 'nousut')), tyhja);
  return _.size(annetutArvot);
}

function laskeLiikennointikorvaus(arvot) {
  let annetutArvot = _.reject(_.concat(_.map(arvot, 'korvaus'), _.map(arvot, 'nousukorvaus'), _.map(arvot, 'nousut')), tyhja);
  return _.size(annetutArvot);
}

function laskeLipputulo(arvot) {
  let annetutArvot = _.reject(_.concat(_.map(arvot, 'arvolipputulo'), _.map(arvot, 'kausilipputulo'), _.map(arvot, 'kertalipputulo'), _.map(arvot, 'lipputulo')), tyhja);
  return _.size(annetutArvot);
}

function laskeKalusto(arvot) {
  let annetutArvot = _.reject(_.map(arvot, 'lukumaara'), tyhja);
  // Jos yksikin kentta on taytetty, palautetaan 1 piste
  let result = 0;
  if (_.size(annetutArvot) > 0) result = 1;
  return result;
}

function laskeJoukkoliikennetuki(joukkoliikennetuki) {
  return _.size(_.omitBy(joukkoliikennetuki, tyhja));
}

const pistelaskenta = {
  alue: laskeAlue,
  lippuhinta: laskeLippuhinta,
  joukkoliikennetuki: laskeJoukkoliikennetuki,
  liikenneviikko: laskeLiikenteenKysyntaJaTarjonta,
  liikennevuosi: laskeLiikenteenKysyntaJaTarjonta,
  kalusto: laskeKalusto,
  liikennointikorvaus: laskeLiikennointikorvaus,
  lipputulo: laskeLipputulo
};

function laske(tunnusluvut) {
  return _.reduce(tunnusluvut, function(pisteet, value, key) {
    let laskenta = c.coalesce(pistelaskenta[key], v => 0);
    return pisteet + (value ? laskenta(value) : 0);
  }, 0);
}
