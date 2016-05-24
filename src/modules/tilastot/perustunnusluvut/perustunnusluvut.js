import {I18N} from 'aurelia-i18n';
import {inject} from 'aurelia-framework';
import {Cookie} from 'aurelia-cookie';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import {Tunnusluvut} from 'services/tunnusluvut';
import * as t from 'utils/tunnusluvut';
import R from 'ramda';
import 'fetch';

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
  height: 500,
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

@inject(EventAggregator, HttpClient, I18N, Router, Tunnusluvut)
export class Perustunnusluvut {

  constructor(eventAggregator, http, i18n, router, tunnusluvut) {
    this.ea = eventAggregator;
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
    this.i18n = i18n;
    this.router = router;
    this.tunnusluvut = tunnusluvut;
  }

  attached() {
    Cookie.set('XSRF-TOKEN', 'juku');
    this.ea.subscribe('router:navigation:success', router => {
      this.childRoute = router.instruction.params.childRoute;
      this.http.fetch('tilastot/alue-asiakastyytyvaisyys/' + this.childRoute + '?group-by=organisaatioid&group-by=vuosi')
        .then(response => response.json())
        .then(data => {
          let chartOpts = createGraph('Tyytyväisyys joukkoliikenteeseen', '%');
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOpts.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('tunnusluku', R.head(data)),
            title: 'tyytyvaisyys-joukkoliikenteeseen',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.tyytyvaisyysJoukkoliikenteeseen = {
            data: data,
            options: o
          };
        });
      this.http.fetch('tilastot/nousut/' + this.childRoute + '?group-by=organisaatioid&group-by=vuosi')
        .then(response => response.json())
        .then(data => {
          let chartOpts = createGraph('Matkustajamäärät', 'henkilöä');
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOpts.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('tunnusluku', R.head(data)),
            title: 'matkustajamaarat',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.nousut = {
            data: data,
            options: o
          };
        });
      this.http.fetch('tilastot/lahdot/' + this.childRoute + '?group-by=organisaatioid&group-by=vuosi')
        .then(response => response.json())
        .then(data => {
          let chartOpts = createGraph('Lähtöjen määrä', 'kpl');
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOpts.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('tunnusluku', R.head(data)),
            title: 'lahtojen-maara',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.lahdot = {
            data: data,
            options: o
          };
        });
      this.http.fetch('tilastot/linjakilometrit/' + this.childRoute + '?group-by=organisaatioid&group-by=vuosi')
        .then(response => response.json())
        .then(data => {
          let chartOpts = createGraph('Linjakilometrit', 'km');
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOpts.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('tunnusluku', R.head(data)),
            title: 'linjakilometrit',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.linjakilometrit = {
            data: data,
            options: o
          };
        });
      this.http.fetch('avustus-asukas/' + this.childRoute)
        .then(response => response.json())
        .then(data => {
          let chartOpts = createGraph('Valtion rahoitus asukasta kohden', '€');
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOpts.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('myonnettyavustus_asukastakohti', R.head(data)),
            title: 'valtion-rahoitus-asukasta-kohden',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.valtionAvustusPerAsukas = {
            data: data,
            options: o
          };
        });
      this.http.fetch('omarahoitus-asukas/' + this.childRoute)
        .then(response => response.json())
        .then(data => {
          let chartOpts = createGraph('Toimivaltaisen viranomaisen omarahoitus asukasta kohden', '€');
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOpts.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('myonnettyavustus_asukastakohti', R.head(data)),
            title: 'valtion-rahoitus-asukasta-kohden',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.omarahoitusPerAsukas = {
            data: data,
            options: o
          };
        });
      this.http.fetch('psa-nettokustannus/' + this.childRoute)
        .then(response => response.json())
        .then(data => {
          let chartOpts = createGraph('PSA-liikenteen nettokustannukset (kunnan ja valtion maksama subventio)', '€');
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOpts.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('liikennointikorvaus.korvaus-lipputulo.total', R.head(data)),
            title: 'psa-liikenteen-nettokustannukset',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.psaNettokustannukset = {
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
      return R.filter(R.propEq('id', key))(this.organisaatiot)[0].nimi;
    }, groupKeys);
  }

}
