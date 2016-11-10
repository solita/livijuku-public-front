import {I18N} from 'aurelia-i18n';
import {bindable, inject} from 'aurelia-framework';
import d3 from 'd3';
import nv from 'nvd3';
import R from 'ramda';

@inject(Element, I18N)
export class ChartCustomElement {

  @bindable setup;
  @bindable ignoreMissingData;

  constructor(Element, i18n) {
    this.element = Element;
    this.i18n = i18n;
    this.d3 = d3;
    this.nv = nv;
  }

  setupChanged(setup) {
    if (this.element.getElementsByTagName('svg')[0]) {
      d3.selectAll(this.element.getElementsByTagName('svg')[0].childNodes).remove();
    }
    let dataTail = R.tail(setup.data);
    this.csv = setup.csv;
    this.draw(dataTail, setup.options);
    if (dataTail.length && !(this.ignoreMissingData === "true" || this.ignoreMissingData === true)) {
      this.groupsWithoutValues = this.findOrganisationsWithMissingData(dataTail, setup.options);
    }
    this.title = setup.options.title;
  }

  draw(data, options) {
    this.height = data.length ? (options.height || (document.body.clientWidth < 768 ? 300 : 500)) : 100;
    let parseData = () => {
      let graphData = [];
      options.groupKeys.forEach((key, index) => {
        let item = {
          key: options.groupLabels[index],
          values: []
        };
        let xLabelsMissing = options.xLabels;
        data.forEach(value => {
          if (value[0] === key) {
            xLabelsMissing = R.filter(label => { return label !== value[1]; }, xLabelsMissing);
            item.values.push({
              key: item.key,
              series: key,
              x: value[1],
              y: value[options.valueIndex] || null
            });
          }
        });
        if (!(options.chart && options.chart.type === 'lineWithFocusChart')) {
          xLabelsMissing.forEach(label => {
            item.values.push({
              key: item.label,
              series: key,
              x: label,
              y: null
            });
          });
        }
        graphData.push(item);
      });
      return graphData;
    };

    this.subtitle = options.subtitle ? options.subtitle.text : '';

    if (options.chart && options.chart.type === 'lineWithFocusChart') {
      nv.addGraph(() => {
        let chart = nv.models.lineWithFocusChart();

        chart.useVoronoi(false);

        chart.xAxis
          .axisLabel(options.chart.xAxis.axisLabel)
          .tickFormat(options.chart.xAxis.tickFormat);

        chart.x2Axis
          .axisLabel(options.chart.x2Axis.axisLabel)
          .tickFormat(options.chart.x2Axis.tickFormat);

        chart.yAxis
          .axisLabel(options.chart.yAxis.axisLabel)
          .tickFormat(options.chart.yAxis.tickFormat);

        let chartOptions =  R.merge({}, options.chart);

        delete chartOptions.tooltip;
        delete chartOptions.xAxis;
        delete chartOptions.x2Axis;
        delete chartOptions.yAxis;
        delete chartOptions.x;
        delete chartOptions.y;

        chart.options(chartOptions);

        chart.noData(this.i18n.tr('ei-dataa-saatavilla'));
        chart.height = this.height;

        d3.select(this.element.getElementsByTagName('svg')[0])
          .datum(parseData())
          .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
      });
    } else {
      nv.addGraph(() => {
        let chart = nv.models.multiBarChart();
        if (options.chart.xAxis.axisLabel) {
          chart.xAxis.axisLabel(options.chart.xAxis.axisLabel);
        }

        if (options.chart.xAxis.tickFormat) {
          chart.xAxis.tickFormat(options.chart.xAxis.tickFormat);
        }

        if (options.chart.yAxis.axisLabel) {
          chart.yAxis.axisLabel(options.chart.yAxis.axisLabel);
        }

        if (options.chart.yAxis.tickFormat) {
          chart.yAxis.tickFormat(options.chart.yAxis.tickFormat);
        }

        chart.tooltip.valueFormatter(options.chart.tooltip.valueFormatter);

        let chartOptions =  R.merge({}, options.chart);

        delete chartOptions.tooltip;
        delete chartOptions.xAxis;
        delete chartOptions.yAxis;
        delete chartOptions.x;
        delete chartOptions.y;

        chart.options(chartOptions);

        chart.noData(this.i18n.tr('ei-dataa-saatavilla'));

        chart.controlLabels({
          grouped: this.i18n.tr('ryhmitelty'),
          stacked: this.i18n.tr('pinottu')
        });

        chart.height(this.height);

        d3.select(this.element.getElementsByTagName('svg')[0])
          .datum(parseData())
          .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
      });
    }
  }

  findOrganisationsWithMissingData(data, options) {
    let valuesByGroup = {},
      groupsWithoutValues = "";
    this.groupsWithoutValues = null;
    R.forEach(obj => {
      if (R.not(R.isNil(obj[2]))) {
        if (!valuesByGroup[obj[0]]) {
          valuesByGroup[obj[0]] = [];
        }
        valuesByGroup[obj[0]].push(obj[2]);
      }
    }, data);
    let groupKeysWithoutValues = R.without(
      R.map(key => {
        return parseInt(key, 10);
      }, Object.keys(valuesByGroup)), options.groupKeys);
    if (groupKeysWithoutValues.length) {
      groupsWithoutValues = R.map(groupKey => {
        let index = R.indexOf(groupKey, options.groupKeys);
        return options.groupLabels[index];
      }, groupKeysWithoutValues).join(', ');
    }
    return groupsWithoutValues;
  }
}
