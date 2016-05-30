import {Api} from 'services/api';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import {Tunnusluvut} from 'services/tunnusluvut';
import R from 'ramda';
import * as t from 'utils/tunnusluvut';
import * as c from 'utils/core';
import 'fetch';

@inject(Api, EventAggregator, HttpClient, Router, Tunnusluvut)
export class Kaikki {

  constructor(api, eventAggregator, http, router, tunnusluvut) {
    this.api = api;
    this.ea = eventAggregator;
    this.http = http;
    this.api.organisaatiot.then(data => this.organisaatiot = data);
    this.router = router;
    this.chartConfigs = {};
    this.tunnusluvut = tunnusluvut;
    this.filterIndex = false;
    this.tunnuslukuIndex = false;
    this.viranomainen = null;
  }

  activate(model) {
    this.api.organisaatiot.then(data => {
      this.organisaatiot = data;
      this.viranomainen = model;
      if (this.tunnuslukuIndex) {
        this.selectTunnusluku();
      }
    });
  }

  chartSelectTouched(chartIndex, filterId) {
    let chart = this.selectedTunnusluku.charts[chartIndex];
    this.fetchDataForChart('tilastot/' + this.selectedTunnusluku.id + '/' + this.viranomainen + this.generateDataUrl(chart), data => {
      this.chartConfig = this.createChartConfig(chartIndex, data);
    });
  }

  createChartConfig(chartIndex, data) {
    function kuukausiToUTC(vuosikk) {
      let year = parseInt(vuosikk.substring(0, 4), 10);
      let kuukausi = parseInt(vuosikk.substring(4), 10);
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
    let groupKeys = t.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
    let groupLabels = t.getOrganisaatioNames(groupKeys, this.organisaatiot);
    let defaultFilter = _.map(_.filter(chart.filters, f => c.isDefinedNotNull(f.defaultValue)), f => [f.id, f.defaultValue]);
    let yTitle = chart.yTitle(c.coalesce(_.fromPairs(defaultFilter), {}));

    let options = R.merge(chart.options, {
      groupKeys: groupKeys,
      groupLabels: groupLabels,
      xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
      valueIndex: R.indexOf('tunnusluku', R.head(data)),
      title: chart.options.title ? chart.options.title.text : '[otsikko tähän]',
      subtitle: {
        text: yTitle
      }
    });
    options.chart.yAxis.axisLabel = yTitle;

    this.chartConfigs[chartIndex] = {
      data: data,
      options: options
    };
  }

  fetchDataForChart(url, cb) {
    return this.http.fetch(url).then(response => response.json()).then(cb);
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
    if (this.selectedTunnusluku) {
      this.selectedTunnusluku.charts.forEach((chart, index) => {
        this.fetchDataForChart('api/tilastot/' + this.selectedTunnusluku.id + '/' + this.viranomainen + this.generateDataUrl(chart), data => {
          this.chartConfig = this.createChartConfig(index, data);
        });
      });
    }
  }

}
