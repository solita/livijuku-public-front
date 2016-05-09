import {I18N} from 'aurelia-i18n';
import {bindable, inject} from 'aurelia-framework';
import d3 from 'd3';
import nv from 'nvd3';
import R from 'ramda';

@inject(Element, I18N)
export class ChartCustomElement {

  @bindable rawData;
  @bindable options;

  constructor(Element, i18n) {
    this.element = Element;
    this.i18n = i18n;
    this.d3 = d3;
    this.nv = nv;
    this.height = 600;
  }

  bind() {}

  rawDataChanged(rawData) {
    // console.info(rawData);
    if (this.element.getElementsByTagName('svg')[0]) {
      d3.selectAll(this.element.getElementsByTagName('svg')[0].childNodes).remove();
    }
    this.draw(R.tail(rawData), this.options);
  }

  optionsChanged(options) {
    this.title = this.i18n.tr(options.title);
    // this.subtitle = this.i18n.tr(options.subtitle);
  }

  draw(data, options) {
    // console.info(data, options);
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
        xLabelsMissing.forEach(label => {
          item.values.push({
            key: item.label,
            series: key,
            x: label,
            y: null
          });
        });
        graphData.push(item);
      });
      return graphData;
    };

    this.subtitle = options.subtitle.text;

    if (options.chart && options.chart.type === "lineWithFocusChart") {
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

        if (chartOptions.height) {
          this.height = chartOptions.height + 50;
          chart.height(chartOptions.height);
        }

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
          chart.yAxis.axisLabel(options.chart.yAxis.axisLabel)
        }

        if (options.chart.yAxis.tickFormat) {
          chart.yAxis.tickFormat(options.chart.yAxis.tickFormat);
        }

        let chartOptions =  R.merge({}, options.chart);

        delete chartOptions.tooltip;
        delete chartOptions.xAxis;
        delete chartOptions.yAxis;
        delete chartOptions.x;
        delete chartOptions.y;

        chart.options(chartOptions);

        if (chartOptions.height) {
          this.height = chartOptions.height;
          chart.height(chartOptions.height);
        }

        d3.select(this.element.getElementsByTagName('svg')[0])
          .datum(parseData())
          .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
      });
    }
  }
}
