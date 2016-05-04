import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import {Tunnusluvut} from 'services/tunnusluvut';
import R from 'ramda';
import * as c from 'utils/core';
import 'fetch';

@inject(EventAggregator, HttpClient, Router, Tunnusluvut)
export class KaikkiTunnusluvut {

  constructor(eventAggregator, http, router, tunnusluvut) {
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
    this.router = router;
    this.chartConfigs = {};
    this.tunnusluvut = tunnusluvut;
    this.filterIndex = false;
    this.tunnuslukuIndex = false;
  }

  attached() {
    this.ea.subscribe('router:navigation:success', router => {
      this.childRoute = router.instruction.params.childRoute;
      if (this.tunnuslukuIndex) {
        console.info(this.tunnuslukuIndex);
        this.selectTunnusluku();
      }
    });
  }

  chartSelectTouched(chartIndex, filterId) {
    let chart = this.selectedTunnusluku.charts[chartIndex];
    this.fetchDataForChart('tilastot/'+ this.selectedTunnusluku.id + '/' + this.childRoute + this.generateDataUrl(chart), data => {
      this.chartConfig = this.createChartConfig(chartIndex, data);
    });
  }

  createChartConfig(chartIndex, data) {
    function kuukausiToUTC(vuosikk) {
      var year = parseInt(vuosikk.substring(0, 4));
      var kuukausi = parseInt(vuosikk.substring(4));
      return Date.UTC(year, (kuukausi - 1));
    }
    let chart = this.selectedTunnusluku.charts[chartIndex];
    if (chart.groupBy[1] === 'kuukausi') {
      data = _.map(data, row => {
        row[1] = kuukausiToUTC(row[1]);
        return row;
      });
    }
    let xLabelIndex = R.indexOf('vuosi', R.head(data));
    let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
    let groupLabels = this.getOrganisaatioNames(groupKeys);
    var defaultFilter = _.map(_.filter(chart.filters, f => c.isDefinedNotNull(f.defaultValue)), f => [f.id, f.defaultValue]);
    let yTitle = chart.yTitle(c.coalesce(_.fromPairs(defaultFilter), {}));
    console.info(yTitle, defaultFilter);
    let options = R.merge(chart.options, {
      groupKeys: groupKeys,
      groupLabels: groupLabels,
      xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
      valueIndex: R.indexOf('tunnusluku', R.head(data)),
      title: chart.options.title ? chart.options.title.text : '[otsikko tähän]',
      subtitle: {
        text: yTitle
      },
      yAxis: {
        axisLabel: yTitle
      }
    });
    this.chartConfigs[chartIndex] = {
      data: data,
      options: options
    }
  }

  fetchDataForChart(url, cb) {
    return this.http.fetch(url).then(response => response.json()).then(cb);
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

  a = (chart) => {
    let result = '';
    let paramsArr = R.map(filter => {
      let value = false;
      if (filter.defaultValue !== 'ALL') {
        value = filter.id + '=' + filter.defaultValue;
      }
      return value;
    }, chart.filters);
    let filtered = R.filter(value => { return value !== false; }, paramsArr);
    if (filtered.length) {
      result = filtered.join('&');
    }
    return result;
  }

  generateDataUrl = (chart) => {
    let params = this.a(chart);
    let groupByParams = R.map(param => { return '&group-by=' + param; }, chart.groupBy).join('');
    let urlParams = '?' + params + groupByParams;
    return urlParams;
  }

  selectTunnusluku() {
    this.selectedTunnusluku = this.tunnusluvut.tunnusluvut[this.tunnuslukuIndex - 1];
    // console.info(this.tunnuslukuIndex, this.selectedTunnusluku);
    if (this.selectedTunnusluku) {
      this.selectedTunnusluku.charts.forEach((chart, index) => {
        this.fetchDataForChart('tilastot/'+ this.selectedTunnusluku.id + '/' + this.childRoute + this.generateDataUrl(chart), data => {
          this.chartConfig = this.createChartConfig(index, data);
        });
      });
    }
  }

}
