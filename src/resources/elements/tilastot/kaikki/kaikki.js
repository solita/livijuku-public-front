import {Api} from 'resources/services/api';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';
import {Tunnusluvut} from 'resources/services/tunnusluvut';
import R from 'ramda';
import * as t from 'resources/utils/tunnusluvut';
import * as c from 'resources/utils/core';

@inject(Api, EventAggregator, Router, Tunnusluvut)
export class Kaikki {

  constructor(api, eventAggregator, router, tunnusluvut) {
    this.api = api;
    this.ea = eventAggregator;
    this.api.organisaatiot.then(data => this.organisaatiot = data);
    this.router = router;
    this.chartConfigs = {};
    this.tunnusluvut = tunnusluvut;
    this.filterIndex = false;
    this.tunnuslukuIndex = 0;
    this.viranomainen = null;
    this.kuukaudet = ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu","Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];
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
    this.api.fetchDataForChart(`tilastot/${this.selectedTunnusluku.id}/${this.viranomainen}${this.generateDataUrl(chart)}`).then(data => {
      this.chartConfig = this.createChartConfig(chartIndex, data);
    });
  }

  createChartConfig(chartIndex, data_) {
    function kuukausiToUTC(vuosikk) {
      let year = parseInt(vuosikk.substring(0, 4), 10);
      let kuukausi = parseInt(vuosikk.substring(4), 10);
      return Date.UTC(year, (kuukausi - 1));
    }
    let chart = this.selectedTunnusluku.charts[chartIndex];
    let data = R.clone(data_);
    if (chart.groupBy[1] === 'kuukausi') {
      data = _.map(data_, (row, index) => {
        if (index === 0) {
          row.push('kuukausi');
          row.push('kuukausi_nimi');
          row.push('vuosi');
        } else {
          let timestamp = R.clone(row[1]);
          let kuukausi = parseInt(timestamp.substring(4), 10);
          row.push(kuukausi);
          row.push(this.kuukaudet[kuukausi - 1]);
          row.push(parseInt(timestamp.substring(0, 4), 10));
          row[1] = kuukausiToUTC(row[1]);
        }
        return row;
      });
    }
    let xLabelIndex = R.indexOf('vuosi', R.head(data));
    let groupKeys = t.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
    let groupLabels = R.map(organisaatio => {
      return organisaatio.replace(" ELY", "");
    }, t.getOrganisaatioNames(groupKeys, this.organisaatiot));
    let defaultFilter = _.map(_.filter(chart.filters, f => c.isDefinedNotNull(f.defaultValue)), f => [f.id, f.defaultValue]);
    let yTitle = chart.yTitle(c.coalesce(_.fromPairs(defaultFilter), {}));

    let options = R.merge(chart.options, {
      groupKeys: groupKeys,
      groupLabels: groupLabels,
      xLabels: xLabelIndex !== -1 ? R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))) : [],
      valueIndex: R.indexOf('tunnusluku', R.head(data)),
      title: chart.options.title ? chart.options.title.text : '[otsikko tähän]',
      subtitle: {
        text: yTitle
      }
    });
    options.chart.yAxis.axisLabel = yTitle;

    this.chartConfigs[chartIndex] = {
      csv: t.addOrganisaationimiColumn(data_, this.organisaatiot),
      data: data,
      options: options
    };
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
    this.selectedTunnusluku = this.tunnusluvut.tunnusluvut[this.tunnuslukuValikko.selected - 1];
    if (this.selectedTunnusluku) {
      this.selectedTunnusluku.charts.forEach((chart, index) => {
        this.api.fetchDataForChart('tilastot/' + this.selectedTunnusluku.id + '/' + this.viranomainen + this.generateDataUrl(chart)).then(data => {
          this.chartConfig = this.createChartConfig(index, data);
        });
      });
    }
  }

}
