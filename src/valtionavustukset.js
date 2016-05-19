import {I18N} from 'aurelia-i18n';
import {inject} from 'aurelia-framework';
import {Cookie} from 'aurelia-cookie';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import R from 'ramda';
import * as t from 'utils/tunnusluvut';
import 'fetch';

const chartOptions = {
  chart: {
    color: ['#aec7e8', '#1f77b4', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5',
      '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5',
      '#6b6ecf', '#b5cf6b', '#bd9e39', '#d6616b', '#a55194', '#9c9ede', '#cedb9c', '#e7ba52', '#ce6dbd', '#de9ed6',
      '#3182bd', '#e6550d', '#fdae6b', '#31a354', '#969696'],
    type: 'multiBarChart',
    height: 500,
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

@inject(EventAggregator, HttpClient, I18N, Router)
export class Valtionavustukset {

  constructor(eventAggregator, http, i18n, router) {
    this.ea = eventAggregator;
    this.haetutMyonnetytKey = 'M';
    this.i18n = i18n;
    http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl('api/')
        .withInterceptor({
          request: function(request) {
            request.headers.set('x-xsrf-token', 'juku');
            return request;
          }
        });
    });
    this.http = http;
    this.http.fetch('organisaatiot')
      .then(response => response.json())
      .then(data => {
        this.organisaatiot = data;
      });
    this.router = router;
    this.chartOptions = {};
  }

  attached() {
    Cookie.set('XSRF-TOKEN', 'juku');
    this.ea.subscribe('router:navigation:success', router => {
      this.childRoute = router.instruction.params.childRoute;
      if (router.instruction.fragment.indexOf('valtionavustukset') !== -1 && !this.childRoute) {
        // return this.router.navigate('valtionavustukset/ALL');
      }

      this.http.fetch('avustus/' + this.childRoute)
        .then(response => response.json())
        .then(data => {
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('avustustyyppi', R.head(data)), data);
          let groupLabels = [this.i18n.tr('haetut'), this.i18n.tr('myonnetyt')];
          let o = R.merge(chartOptions, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('sum(rahamaara)', R.head(data)),
            title: 'joukkoliikenteen-haetut-ja-myonnetut-avustukset',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.haetutJaMyonnetytAvustukset = {
            data: data,
            options: o
          };
        }, error => {
          throw new Error('virhe');
        });
      this.http.fetch('avustus-details/' + this.childRoute)
        .then(response => response.json())
        .then(data => {
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOptions, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('haettavaavustus', R.head(data)),
            title: 'haetut-avustukset-organisaatioittain',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.haetutAvustuksetOrganisaatioittain = {
            data: data,
            options: o
          };
          let o2 = R.merge(chartOptions, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('myonnettyavustus', R.head(data)),
            title: 'myonnetyt-avustukset-organisaatioittain',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.myonnetytAvustuksetOrganisaatioittain = {
            data: data,
            options: o2
          };
        });
      this.http.fetch('avustus-asukas/' + this.childRoute)
        .then(response => response.json())
        .then(data => {
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOptions, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('myonnettyavustus_asukastakohti', R.head(data)),
            title: 'myonnetty-avustus-per-asukas',
            subtitle: this.childRoute,
            height: 600
          });
          this.avustusPerAsukas = {
            data: data,
            options: o
          };
        });
    });
  }

  getGroupKeys = (groupIndex, data) => {
    return R.sort((a, b) => {
      return a - b;
    }, R.uniq(R.map(item => {
      return item[groupIndex];
    }, R.tail(data))));
  }

  getOrganisaatioNames = (groupKeys) => {
    return R.map(key => {
      return R.find(R.propEq('id', key))(this.organisaatiot).nimi;
    }, groupKeys);
  }

  toggleHaetutMyonnetytKey() {
    this.haetutMyonnetytKey = this.haetutMyonnetytKey === 'M' ? 'H' : 'M';
  }
}
