import {I18N} from 'aurelia-i18n';
import {inject} from 'aurelia-framework';
import _ from 'lodash';
import * as c from '../utils/core';
import * as t from '../utils/tunnusluvut';
import d3 from 'd3';
import R from 'ramda';

@inject(I18N)
export class Tunnusluvut {

  constructor(i18n) {
    this.i18n = i18n;

    let nimi = function(id) {
      return this[id];
    };

    let kuukaudet = {
      ALL: 'Koko vuosi', 1: 'Tammikuu', 2: 'Helmikuu', 3: 'Maaliskuu', 4: 'Huhtikuu', 5: 'Toukokuu',
      6: 'Kesäkuu', 7: 'Heinäkuu', 8: 'Elokuu', 9: 'Syyskuu', 10: 'Lokakuu', 11: 'Marraskuu', 12: 'Joulukuu',
      $order: ['ALL'].concat(_.range(1, 13)),
      $nimi: nimi,
      $id: 'kuukausi'
    };

    let paastoluokat = {
      ALL: 'Kaikki', E0: 'EURO 0', E1: 'EURO 1', E2: 'EURO 2', E3: 'EURO 3', E4: 'EURO 4', E5: 'EURO 5/EEV', E6: 'EURO 6',
      $order: ['ALL'].concat(_.map(_.range(0, 7), i => 'E' + i)),
      $nimi: nimi,
      $id: 'paastoluokkatunnus'
    };

    let viikonpaivaluokat = {
      A: 'Arkipäivä', LA: 'Lauantai', SU: 'Sunnuntai',
      $order: ['A', 'LA', 'SU'],
      $nimi: nimi,
      $id: 'viikonpaivaluokkatunnus'
    };

    let lipputuloluokat = {
      ALL: 'Kaikki', KE: 'Kertalippu', AR: 'Arvolippu', KA: 'Kausilippu',
      $order: ['ALL', 'KE', 'AR', 'KA'],
      $nimi: nimi,
      $id: 'lipputuloluokkatunnus'
    };

    let lippuhintaluokat = {
      KE: 'Kertalippu', KA: 'Kausilippu',
      $order: ['KE', 'KA'],
      $nimi: v => lippuhintaluokat[v],
      $id: 'lippuhintaluokkatunnus'
    };

    let kustannuslajit = {
      ALL: 'Kaikki', AP: 'Asiakaspalvelu', KP: 'Konsulttipalvelu',
      LP: 'Lipunmyyntipalkkiot', TM: 'Tieto-/maksujärjestelmät', MP: 'Muut palvelut',
      $order: ['ALL', 'AP', 'KP', 'LP', 'TM', 'MP'],
      $nimi: nimi,
      $id: 'kustannuslajitunnus'
    };

    let organisaatiolajit = {
      ALL: 'Kaikki organisaatiot',
      KS1: 'Suuret kaupunkiseudut',
      KS2: 'Keskisuuret kaupunkiseudut',
      KS3: 'Pienet kaupunkiseudut',
      ELY: 'ELY-keskukset',
      $order: ['ALL', 'KS1', 'KS2', 'KS3', 'ELY'],
      $nimi: nimi,
      $id: 'organisaatiolajitunnus'
    };

    let sopimustyypit = {
      ALL: 'Kaikki sopimustyypit',
      BR: 'PSA brutto',
      KOS: 'PSA KOS',
      SA: 'Siirtymäajan liikenne',
      ME: 'Markkinaehtoinen liikenne',
      $order: ['ALL', 'BR', 'KOS', 'SA', 'ME'],
      $nimi: nimi,
      $id: 'sopimustyyppitunnus'
    };

    let vuodet = {
      $order: _.range(2013, 2017).reverse(),
      $nimi: _.identity,
      $id: 'vuosi'
    };

    let vyohykemaarat = {
      $order: _.range(1, 7),
      $nimi: id => id === 1 ? 1 + ' vyöhyke' : id + ' vyöhykettä',
      $id: 'vyohykemaara'
    };

    let createLineChartKK = (title, xLabel) => {
      console.info(title, xLabel);
      return _.merge(
        createChart(title, 'Kuukausi'), {
          chart: {
            type: 'lineWithFocusChart',
            margin: {
              bottom: 70
            },
            tooltip: {
              valueFormatter: t.numberFormatTooltip
            },
            xAxis: {
              tickFormat: d => d3.time.format.utc('%m/%Y')(new Date(d))
            },
            yAxis: {
              tickFormat: t.numberFormat
            },
            xScale: d3.time.scale.utc(),
            x2Axis: {
              axisLabel: this.i18n.tr('valitse-tarkasteluvali'),
              tickFormat: d => d3.time.format.utc('%m/%Y')(new Date(d))
            }
          },
          caption: {
            enable: true,
            text: this.i18n.tr('valitse-tarkasteluvali')
          }
        });
    };

    let createFilter = (nimi_, values, defaultValue = 'ALL') => {
      return {
        id: values.$id,
        nimi: nimi_,
        values: values,
        defaultValue: defaultValue
      };
    };

    function convertToTree(name, names, alldata, organisaatiot) {
      var data = _.filter(_.tail(alldata), r => R.not(R.isNil(r[r.length - 1])));
      return data.length > 1 ? [{
        name: name,
        children: group(_.tail(data), 0, [id => _.find(organisaatiot, {id: id}).nimi].concat(names))
      }] : [];
    }

    let createAlueTunnusluku = (id, desc, unit) => {
      return {
        id: 'alue-' + id,
        nimi: this.i18n.tr('alue-' + id),
        charts: [{
          title: 'Alueen ' + this.i18n.tr(desc) + ' vuosittain tarkasteltuna',
          yTitle: filter => unit,
          groupBy: ['organisaatioid', 'vuosi'],
          filters: [],
          options: createMultiBarChart(id, 'Vuosi')
        }]
      };
    };

    let filterInfoText = filter => {
      let txt = luokka => {
        let result = null;
        let v = filter[luokka.$id];
        if (R.not(R.isNil(v)) && v !== 'ALL') {
          result = luokka.$nimi(v);
        }
        return result;
      };

      let info = _.filter(_.map([sopimustyypit, paastoluokat, viikonpaivaluokat, kustannuslajit, lippuhintaluokat], txt), value => {
        return R.not(R.isNil(value));
      }).join(', ');
      return info ? ' (' + info + ')' : '';
    };

    let yTitleTarkastelujakso = (title, filter) => {
      return title + filterInfoText(filter) + ' / ' +
        (filter.kuukausi && filter.kuukausi !== 'ALL' ? kuukaudet[filter.kuukausi] : 'vuosi');
    };

    let createChart = (title, xLabel) => {
      return {
        chart: {
          color: ['#aec7e8', '#1f77b4', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5',
            '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5',
            '#6b6ecf', '#b5cf6b', '#bd9e39', '#d6616b', '#a55194', '#9c9ede', '#cedb9c', '#e7ba52', '#ce6dbd', '#de9ed6',
            '#3182bd', '#e6550d', '#fdae6b', '#31a354', '#969696'],
          height: 450,
          x: d => d[1],
          y: d => d[2],
          yAxis: {
            axisLabel: ''
          },
          xAxis: {
            axisLabel: xLabel
          }
        },
        title: {
          enable: true,
          text: this.i18n.tr(title)
        },
        subtitle: {
          enable: true,
          text: ''
        }
      };
    };

    let createMultiBarChart = (title, xLabel, classification) => {
      return _.merge(
        createChart(title, xLabel), {
          chart: {
            type: 'multiBarChart',
            stacked: false,
            reduceXTicks: false,
            groupSpacing: 0.2,
            tooltip: {
              valueFormatter: t.numberFormatTooltip
            },
            yAxis: {
              tickFormat: t.numberFormat
            },
            xAxis: {
              tickFormat: d => R.not(R.isNil(classification)) ? classification.$nimi(d) : d
            }
          }
        });
    };

    this.tunnusluvut = [{
      id: 'nousut',
      nimi: this.i18n.tr('nousut'),
      charts: [{
        title: this.i18n.tr('nousujen-lukumaara-vuosittain-tarkasteltuna'),
        yTitle: _.partial(yTitleTarkastelujakso, 'Nousut'),
        groupBy: ['organisaatioid', 'vuosi'],
        filters: [
          createFilter('Sopimustyyppi', sopimustyypit),
          createFilter('Tarkastelujakso', kuukaudet)],
        options: createMultiBarChart('Kysyntä', 'Vuosi')
      }
      , {
        title: this.i18n.tr('nousujen-lukumaara-kuukausitasolla'),
        yTitle: filter => {
          return this.i18n.tr('nousut') + filterInfoText(filter) + ' / ' + this.i18n.tr('kuukausi')
        },
        groupBy: ['organisaatioid', 'kuukausi'],
        filters: [
          createFilter('Sopimustyyppi', sopimustyypit)],
        options: createLineChartKK('Kysyntä')
      }
    ]}, {
      id: 'lahdot',
      nimi: this.i18n.tr('lahdot'),
      charts: [{
        title: 'Lähtöjen lukumäärä vuosittain tarkasteltuna',
        yTitle: _.partial(yTitleTarkastelujakso, 'Lähdöt'),
        groupBy: ['organisaatioid', 'vuosi'],
        filters: [
          createFilter('Sopimustyyppi', sopimustyypit),
          createFilter('Tarkastelujakso', kuukaudet)],
        options: createMultiBarChart('Tarjonta', 'Vuosi')
      }, {
        title: 'Lähtöjen lukumäärä kuukausitasolla',
        yTitle: filter => 'Lähdöt' + filterInfoText(filter) + ' / kuukausi',
        groupBy: ['organisaatioid', 'kuukausi'],
        filters: [
          createFilter('Sopimustyyppi', sopimustyypit)],
        options: createLineChartKK('Tarjonta')
      }]
    }, {
      id: 'linjakilometrit',
      nimi: this.i18n.tr('linjakilometrit'),
      charts: [{
        title: 'Linjakilometrien lukumäärä vuosittain tarkasteltuna',
        yTitle: _.partial(yTitleTarkastelujakso, 'Linjakilometrit'),
        groupBy: ['organisaatioid', 'vuosi'],
        filters: [
          createFilter('Sopimustyyppi', sopimustyypit),
          createFilter('Tarkastelujakso', kuukaudet)],
        options: createMultiBarChart('Tarjonta', 'Vuosi')
      }, {
        title: 'Linjakilometrien lukumäärä kuukausitasolla',
        yTitle: filter => 'Linjakilometrit' + filterInfoText(filter) + ' / kuukausi',
        groupBy: ['organisaatioid', 'kuukausi'],
        filters: [
          createFilter('Sopimustyyppi', sopimustyypit)],
        options: createLineChartKK('Tarjonta')
      }]
    }, {
      id: 'nousut-viikko',
      nimi: this.i18n.tr('nousut-paiva'),
      charts: [{
        title: 'Nousijat keskimääräisenä talviliikenteen (syyskuu-toukokuu) arkipäivänä, lauantaina tai sunnuntaina',
        yTitle: filter => 'Nousut' + filterInfoText(filter),
        groupBy: ['organisaatioid', 'vuosi'],
        filters: [
          createFilter('Sopimustyyppi', sopimustyypit),
          createFilter('Viikonpäivä', viikonpaivaluokat, 'A')],
        options: createMultiBarChart('Kysyntä', 'Vuosi')
      }, {
        title: 'Valitun vuoden talviliikenteen nousijat viikonpäiväluokittain (arkipäivänä/lauantaina/sunnuntaina)',
        yTitle: filter => 'Nousut' + filterInfoText(filter) + ' / päivä vuonna ' + filter.vuosi,
        groupBy: ['organisaatioid', 'viikonpaivaluokkatunnus'],
        filters: [
          createFilter('Vuosi', vuodet, '2016'),
          createFilter('Sopimustyyppi', sopimustyypit)],
        options: createMultiBarChart('Kysyntä', 'Viikonpäiväluokka', viikonpaivaluokat)
      }]
    }, {
      id: 'lahdot-viikko',
      nimi: this.i18n.tr('lahdot-paiva'),
      charts: [{
        title: 'Vuorotarjonta keskimääräisenä talviliikenteen (syyskuu-toukokuu) arkipäivänä/lauantaina/sunnuntaina vuosittain',
        yTitle: filter => 'Lähdöt' + filterInfoText(filter),
        groupBy: ['organisaatioid', 'vuosi'],
        filters: [
          createFilter('Sopimustyyppi', sopimustyypit),
          createFilter('Viikonpäivä', viikonpaivaluokat, 'A')],
        options: createMultiBarChart('Tarjonta', 'Vuosi')
      }, {
        title: 'Valitun vuoden talviliikenteen vuorotarjonta viikonpäiväluokittain',
        yTitle: filter => 'Lähdöt' + filterInfoText(filter) + ' / päivä vuonna ' + filter.vuosi,
        groupBy: ['organisaatioid', 'viikonpaivaluokkatunnus'],
        filters: [
          createFilter('Vuosi', vuodet, '2016'),
          createFilter('Sopimustyyppi', sopimustyypit)],
        options: createMultiBarChart('Tarjonta', 'Viikonpäiväluokka', viikonpaivaluokat)
      }]
    }, {
      id: 'linjakilometrit-viikko',
      nimi: this.i18n.tr('linjakilometrit-paiva'),
      charts: [{
        title: 'Linjakilometrit keskimääräisenä talviliikenteen (syyskuu-toukokuu) arkipäivänä/lauantaina/sunnuntaina vuosittain',
        yTitle: filter => 'Linjakilometrit' + filterInfoText(filter),
        groupBy: ['organisaatioid', 'vuosi'],
        filters: [
          createFilter('Sopimustyyppi', sopimustyypit),
          createFilter('Viikonpäivä', viikonpaivaluokat, 'A')],
        options: createMultiBarChart('Tarjonta', 'Vuosi')
      }, {
        title: 'Valitun vuoden talviliikenteen linjakilometrit viikonpäiväluokittain (arkipäivänä/lauantaina/sunnuntaina)',
        yTitle: filter => 'Linjakilometrit' + filterInfoText(filter) + ' / päivä vuonna ' + filter.vuosi,
        groupBy: ['organisaatioid', 'viikonpaivaluokkatunnus'],
        filters: [
          createFilter('Vuosi', vuodet, '2016'),
          createFilter('Sopimustyyppi', sopimustyypit)],
        options: createMultiBarChart('Tarjonta', 'Viikonpäiväluokka', viikonpaivaluokat)
      }]
    }, {
      id: 'liikennointikorvaus',
      nimi: this.i18n.tr('liikennointikorvaus'),
      charts: [{
        title: 'Liikennöintikorvaus vuosittain tarkasteltuna',
        yTitle: _.partial(yTitleTarkastelujakso, 'Liikennöintikorvaus'),
        groupBy: ['organisaatioid', 'vuosi'],
        filters: [
          createFilter('Sopimustyyppi', sopimustyypit),
          createFilter('Tarkastelujakso', kuukaudet)],
        options: createMultiBarChart('Liikennöintikorvaus', 'Vuosi')
      }, {
        title: 'Liikennöintikorvaus kuukausitasolla',
        yTitle: filter => 'Liikennöintikorvaus' + filterInfoText(filter) + ' / kuukausi',
        groupBy: ['organisaatioid', 'kuukausi'],
        filters: [
          createFilter('Sopimustyyppi', sopimustyypit)],
        options: createLineChartKK('Liikennöintikorvaus')
      }]
    }, {
      id: 'lipputulo',
      nimi: this.i18n.tr('lipputulo'),
      charts: [{
        title: 'Lipputulo vuosittain tarkasteltuna',
        yTitle: _.partial(yTitleTarkastelujakso, 'Lipputulo €'),
        groupBy: ['organisaatioid', 'vuosi'],
        filters: [
          createFilter('Sopimustyyppi', sopimustyypit),
          createFilter('Lipputyyppi', lipputuloluokat),
          createFilter('Tarkastelujakso', kuukaudet)],
        options: createMultiBarChart('Lipputulo', 'Vuosi')
      }, {
        title: 'Lipputulo kuukausitasolla',
        yTitle: filter => 'Lipputulo' + filterInfoText(filter) + ' / kuukausi',
        groupBy: ['organisaatioid', 'kuukausi'],
        filters: [
          createFilter('Sopimustyyppi', sopimustyypit),
          createFilter('Lipputyyppi', lipputuloluokat)],
        options: createLineChartKK('Lipputulo')
      }]
    }, {
      id: 'kalusto',
      nimi: this.i18n.tr('kalusto'),
      charts: [{
        title: 'Kaluston lukumäärä vuosittain tarkasteltuna',
        yTitle: filter => 'Kaluston lukumäärä' + filterInfoText(filter),
        groupBy: ['organisaatioid', 'vuosi'],
        filters: [
          createFilter('Sopimustyyppi', sopimustyypit),
          createFilter('Päästöluokka', paastoluokat)],
        options: createMultiBarChart('Kalusto', 'Vuosi')
      }, {
        title: 'Kaluston lukumäärä päästöluokittain',
        yTitle: filter => 'Kaluston lukumäärä' + filterInfoText(filter) + ' vuonna ' + filter.vuosi,
        groupBy: ['organisaatioid', 'paastoluokkatunnus'],
        filters: [
          createFilter('Vuosi', vuodet, '2016'),
          createFilter('Sopimustyyppi', sopimustyypit)],
        options: createMultiBarChart('Kalusto', 'Päästöluokka', paastoluokat)
      }]
    }, {
      id: 'kustannukset',
      nimi: this.i18n.tr('kustannukset'),
      charts: [{
        title: 'Kustannukset vuosittain tarkasteltuna',
        yTitle: filter => 'Kustannukset' + filterInfoText(filter) + ' € / vuosi',
        groupBy: ['organisaatioid', 'vuosi'],
        filters: [
          createFilter('Kustannuslaji', kustannuslajit)],
        options: createMultiBarChart('Kustannukset', 'Vuosi')
      }, {
        title: 'Vuoden kustannukset kustannuslajeittain',
        yTitle: filter => 'Kustannukset (€)' + filterInfoText(filter) + ' vuonna ' + filter.vuosi,
        groupBy: ['organisaatioid', 'kustannuslajitunnus'],
        filters: [
          createFilter('Vuosi', vuodet, '2016')],
        options: createMultiBarChart('Kustannukset', 'Kustannuslaji', kustannuslajit)
      }]
    }, {
      id: 'lippuhinnat',
      nimi: this.i18n.tr('lippuhinnat'),
      charts: [{
        title: 'Lippuhinnat vuosittain tarkasteltuna',
        yTitle: filter => 'Lippuhinta' + filterInfoText(filter) + ' €',
        groupBy: ['organisaatioid', 'vuosi'],
        filters: [
          createFilter('Lipputyyppi', lippuhintaluokat, 'KE'),
          createFilter('Vyöhykemäärä', vyohykemaarat, '1')],
        options: createMultiBarChart('Lippuhinnat', 'Vuosi')
      }, {
        title: 'Vuoden lippuhinnat vyöhykeittäin',
        yTitle: filter => 'Lippuhinta' + filterInfoText(filter) + ' €',
        groupBy: ['organisaatioid', 'vyohykemaara'],
        filters: [
          createFilter('Vuosi', vuodet, '2016'),
          createFilter('Lipputyyppi', lippuhintaluokat, 'KE')],
        options: createMultiBarChart('Lippuhinnat', 'Vyöhykemäärä', vyohykemaarat)
      }, {
        title: 'Vuoden lippuhinnat vyöhykeittäin ja lipputyypeittäin',
        yTitle: filter => undefined,
        data: _.partial(convertToTree, 'Lippuhinnat', [vyohykemaarat.$nimi, lippuhintaluokat.$nimi]),
        groupBy: ['organisaatioid', 'vyohykemaara', 'lippuhintaluokkatunnus'],
        filters: [createFilter('Vuosi', vuodet, '2016')],
        options: {
          chart: {
            type: 'sunburstChart',
            height: 450
            //mode: 'size'
          }
        }
      }]
    },
      createAlueTunnusluku('kuntamaara', 'kuntien-lukumaara', 'Lukumäärä (kpl)'),
      createAlueTunnusluku('vyohykemaara', 'vyohykkeiden-lukumaara', 'Lukumäärä (kpl)'),
      createAlueTunnusluku('pysakkimaara', 'pysäkkien lukumäärä', 'Lukumäärä (kpl)'),
      createAlueTunnusluku('maapintaala', 'maapintaala', 'Neliökilometri (km2)'),
      createAlueTunnusluku('asukasmaara', 'asukkaiden lukumäärä', 'Lukumäärä (kpl)'),
      createAlueTunnusluku('tyopaikkamaara', 'työpaikkojen lukumäärä', 'Lukumäärä (kpl)'),
      createAlueTunnusluku('henkilosto', 'suunnittelun ja organisaation henkilöstö', 'Henkilötyövuotta'),
      createAlueTunnusluku('pendeloivienosuus', 'pendelöivien osuus (oman kunnan ulkopuolella työssäkäynti)', 'Prosenttia työssäkäyvistä (%)'),
      createAlueTunnusluku('henkiloautoliikennesuorite', 'henkilöautoliikennesuorite', 'Milj. km / vuosi'),
      createAlueTunnusluku('autoistumisaste', 'autoistumisaste', 'Autoa (kpl) / 1000 asukasta'),
      createAlueTunnusluku('asiakastyytyvaisyys', 'tyytyväisten joukkoliikenteen käyttäjien osuus', 'Prosenttia (%)')
    ];
  }
}
