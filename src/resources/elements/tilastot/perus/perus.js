import {Api} from 'resources/services/api';
import {I18N} from 'aurelia-i18n';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import {Tunnusluvut} from 'resources/services/tunnusluvut';
import * as t from 'resources/utils/tunnusluvut';
import R from 'ramda';

const subtitle = {
  enable: true,
  text: 'Suuret kaupunkiseudut'
};

const colors = ['#aec7e8', '#1f77b4', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5',
                '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5',
                '#6b6ecf', '#b5cf6b', '#bd9e39', '#d6616b', '#a55194', '#9c9ede', '#cedb9c', '#e7ba52', '#ce6dbd', '#de9ed6',
                '#3182bd', '#e6550d', '#fdae6b', '#31a354', '#969696'];

const chartOptions = ytitle => ({
  color: colors,
  type: 'multiBarChart',
  stacked: false,
  showControls: false,
  tooltip: {valueFormatter: t.numberFormatTooltip},
  x: d => d[1],
  y: d => d[2],
  yAxis: {
    axisLabel: ytitle,
    tickFormat: t.numberFormat
  },
  xAxis: {
    axisLabel: 'Vuosi'
  }
});

const createGraph = (title, ytitle) => ({
  options: {
    chart: chartOptions(ytitle),
    title: {
      enable: true,
      text: title
    },
    subtitle: subtitle
  }
});

@inject(Api, EventAggregator, HttpClient, I18N, Router, Tunnusluvut)
export class Perustunnusluvut {

  constructor(api, eventAggregator, http, i18n, router, tunnusluvut) {
    this.api = api;
    this.ea = eventAggregator;
    this.http = http;
    this.api.organisaatiot.then(data => this.organisaatiot = data);
    this.i18n = i18n;
    this.router = router;
    this.tunnusluvut = tunnusluvut;
    this.viranomainen = null;
  }

  activate(model) {
    this.api.organisaatiot.then(organisaatiot => {
      this.organisaatiot = organisaatiot;
      this.viranomainen = model;
      this.api.getTyytyvaisyysJoukkoliikenteeseen(this.viranomainen).then(data => {
        let chartOpts = createGraph('Tyytyväisyys joukkoliikenteeseen', '%');
        let xLabelIndex = R.indexOf('vuosi', R.head(data));
        let groupKeys = t.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
        let groupLabels = t.getOrganisaatioNames(groupKeys, this.organisaatiot);
        this.tyytyvaisyysJoukkoliikenteeseen = {
          data: data,
          options: R.merge(chartOpts.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            height: 500,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('tunnusluku', R.head(data)),
            title: this.i18n.tr('tyytyvaisyys-joukkoliikenteeseen'),
            subtitle: {
              text: this.i18n.tr(this.viranomainen)
            }
          })
        };
      });
      this.api.getMatkustajamaarat(this.viranomainen).then(data => {
        let chartOpts = createGraph('Matkustajamäärät', 'henkilöä');
        let xLabelIndex = R.indexOf('vuosi', R.head(data));
        let groupKeys = t.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
        let groupLabels = t.getOrganisaatioNames(groupKeys, this.organisaatiot);
        this.nousut = {
          data: data,
          options: R.merge(chartOpts.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            height: 500,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('tunnusluku', R.head(data)),
            title: this.i18n.tr('matkustajamaarat'),
            subtitle: {
              text: this.i18n.tr(this.viranomainen)
            }
          })
        };
      });
      this.api.getLahtojenMaara(this.viranomainen).then(data => {
        let chartOpts = createGraph('Lähtöjen määrä', 'kpl');
        let xLabelIndex = R.indexOf('vuosi', R.head(data));
        let groupKeys = t.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
        let groupLabels = t.getOrganisaatioNames(groupKeys, this.organisaatiot);
        this.lahdot = {
          data: data,
          options: R.merge(chartOpts.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            height: 500,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('tunnusluku', R.head(data)),
            title: this.i18n.tr('lahtojen-maara'),
            subtitle: {
              text: this.i18n.tr(this.viranomainen)
            }
          })
        };
      });
      this.api.getLinjakilometrit(this.viranomainen).then(data => {
        let chartOpts = createGraph('Linjakilometrit', 'km');
        let xLabelIndex = R.indexOf('vuosi', R.head(data));
        let groupKeys = t.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
        let groupLabels = t.getOrganisaatioNames(groupKeys, this.organisaatiot);
        this.linjakilometrit = {
          data: data,
          options: R.merge(chartOpts.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            height: 500,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('tunnusluku', R.head(data)),
            title: this.i18n.tr('linjakilometrit'),
            subtitle: {
              text: this.i18n.tr(this.viranomainen)
            }
          })
        };
      });
      this.api.getValtionRahoitusAsukastaKohden(this.viranomainen).then(data => {
        let chartOpts = createGraph('Valtion rahoitus asukasta kohden', '€');
        let xLabelIndex = R.indexOf('vuosi', R.head(data));
        let groupKeys = t.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
        let groupLabels = t.getOrganisaatioNames(groupKeys, this.organisaatiot);
        this.valtionAvustusPerAsukas = {
          data: data,
          options: R.merge(chartOpts.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            height: 500,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('myonnettyavustus_asukastakohti', R.head(data)),
            title: this.i18n.tr('valtion-rahoitus-asukasta-kohden'),
            subtitle: {
              text: this.i18n.tr(this.viranomainen)
            }
          })
        };
      });
      this.api.getToimivaltaisenViranomaisenOmarahoitusAsukastaKohden(this.viranomainen).then(data => {
        let chartOpts = createGraph('Toimivaltaisen viranomaisen omarahoitus asukasta kohden', '€');
        let xLabelIndex = R.indexOf('vuosi', R.head(data));
        let groupKeys = t.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
        let groupLabels = t.getOrganisaatioNames(groupKeys, this.organisaatiot);
        this.omarahoitusPerAsukas = {
          data: data,
          options: R.merge(chartOpts.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            height: 500,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('myonnettyavustus_asukastakohti', R.head(data)),
            title: this.i18n.tr('toimivaltaisen-viranomaisen-omarahoitus-asukasta-kohden'),
            subtitle: {
              text: this.i18n.tr(this.viranomainen)
            }
          })
        };
      });
      this.api.getPsaLiikenteenNettokustannukset(this.viranomainen).then(data => {
        let chartOpts = createGraph('PSA-liikenteen nettokustannukset (kunnan ja valtion maksama subventio)', '€');
        let xLabelIndex = R.indexOf('vuosi', R.head(data));
        let groupKeys = t.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
        let groupLabels = t.getOrganisaatioNames(groupKeys, this.organisaatiot);
        this.psaNettokustannukset = {
          data: data,
          options: R.merge(chartOpts.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            height: 500,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('liikennointikorvaus.korvaus-lipputulo.total', R.head(data)),
            title: this.i18n.tr('psa-liikenteen-nettokustannukset'),
            subtitle: {
              text: this.i18n.tr(this.viranomainen)
            }
          })
        };
      });
    });
  }
}
