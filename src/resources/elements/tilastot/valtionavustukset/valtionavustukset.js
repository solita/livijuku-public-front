import {Api} from 'resources/services/api';
import {I18N} from 'aurelia-i18n';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';
import R from 'ramda';
import * as t from 'resources/utils/tunnusluvut';

const chartOptions = {
  chart: {
    color: ['#aec7e8', '#1f77b4', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5',
      '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5',
      '#6b6ecf', '#b5cf6b', '#bd9e39', '#d6616b', '#a55194', '#9c9ede', '#cedb9c', '#e7ba52', '#ce6dbd', '#de9ed6',
      '#3182bd', '#e6550d', '#fdae6b', '#31a354', '#969696'],
    type: 'multiBarChart',
    stacked: false,
    showControls: false,
    tooltip: {valueFormatter: t.numberFormatTooltip},
    x: d => d[1],
    y: d => d[2],
    yAxis: {
      axisLabel: '€',
      tickFormat: t.numberFormat
    },
    xAxis: {
      axisLabel: 'Vuosi'
    }
  }
};

@inject(Api, EventAggregator, I18N, Router)
export class Valtionavustukset {

  constructor(api, eventAggregator, i18n, router) {
    this.api = api;
    this.chartOptions = {};
    this.ea = eventAggregator;
    this.i18n = i18n;
    this.viranomainen = null;
    this.router = router;
  }

  activate(model) {
    return this.api.organisaatiot.then(organisaatiot => {
      this.organisaatiot = organisaatiot;
      this.viranomainen = model;
      this.api.getAvustukset(this.viranomainen).then(data_ => {
        let data = R.head(data_);
        let xLabelIndex = R.indexOf('vuosi', data);
        let groupKeys = t.getGroupKeys(R.indexOf('avustustyyppi', data), data_);
        let groupLabels = [this.i18n.tr('haetut'), this.i18n.tr('myonnetyt')];
        this.haetutJaMyonnetytAvustukset = {
          csv: R.tail(data_),
          data: data_,
          options: R.merge(chartOptions, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            height: document.body.clientWidth < 768 ? 300 : 500,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data_))),
            valueIndex: R.indexOf('sum(rahamaara)', data),
            title: this.i18n.tr('joukkoliikenteen-haetut-ja-myonnetut-avustukset'),
            subtitle: {
              text: this.i18n.tr(this.viranomainen)
            }
          })
        };
      });
      this.api.getAvustuksetOrganisaatioittain(this.viranomainen).then(data_ => {
        let data = R.head(data_);
        let xLabelIndex = R.indexOf('vuosi', data);
        let groupKeys = t.getGroupKeys(R.indexOf('organisaatioid', data), data_);
        let groupLabels = R.map(organisaatio => {
          return organisaatio.replace(" ELY", "");
        }, t.getOrganisaatioNames(groupKeys, this.organisaatiot));
        this.haetutAvustuksetOrganisaatioittain = {
          csv: t.addOrganisaationimiColumn(data_, this.organisaatiot),
          data: data_,
          options: R.merge(chartOptions, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            height: document.body.clientWidth < 768 ? 300 : 500,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data_))),
            valueIndex: R.indexOf('haettavaavustus', data),
            title: this.i18n.tr('haetut-avustukset-organisaatioittain'),
            subtitle: {
              text: this.i18n.tr(this.viranomainen)
            }
          })
        };
        this.myonnetytAvustuksetOrganisaatioittain = {
          csv: t.addOrganisaationimiColumn(data_, this.organisaatiot),
          data: data_,
          options: R.merge(chartOptions, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            height: document.body.clientWidth < 768 ? 300 : 500,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data_))),
            valueIndex: R.indexOf('myonnettyavustus', data),
            title: this.i18n.tr('myonnetyt-avustukset-organisaatioittain'),
            subtitle: {
              text: this.i18n.tr(this.viranomainen)
            }
          })
        };
      });
      this.api.getAvustusPerAsukas(this.viranomainen).then(data_ => {
        let data = R.head(data_);
        let xLabelIndex = R.indexOf('vuosi', data);
        let groupKeys = t.getGroupKeys(R.indexOf('organisaatioid', data), data_);
        let groupLabels = R.map(organisaatio => {
          return organisaatio.replace(" ELY", "");
        }, t.getOrganisaatioNames(groupKeys, this.organisaatiot));
        this.avustusPerAsukas = {
          csv: t.addOrganisaationimiColumn(data_, this.organisaatiot),
          data: data_,
          options: R.merge(chartOptions, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            height: document.body.clientWidth < 768 ? 300 : 500,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data_))),
            valueIndex: R.indexOf('myonnettyavustus_asukastakohti', data),
            title: this.i18n.tr('myonnetty-avustus-per-asukas'),
            subtitle: this.viranomainen
          })
        };
      });
    });
  }
}
