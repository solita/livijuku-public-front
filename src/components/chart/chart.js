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
    console.info('chart element loading...');
  }

  bind() {}

  rawDataChanged(rawData) {
    console.info(rawData);
    if (this.element.getElementsByTagName('svg')[0]) {
      d3.selectAll(this.element.getElementsByTagName('svg')[0].childNodes).remove();
    }
    this.draw(R.tail(rawData), this.options);
  }

  optionsChanged(options) {
    this.title = this.i18n.tr(options.title);
    this.subtitle = this.i18n.tr(options.subtitle);
    console.info(this.rawData, this.options);
  }

  draw(data, options) {
    console.info(data, options);
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

    nv.addGraph(() => {
      let chart = nv.models.multiBarChart()
        .options({
          duration: 200
        })
        .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
        .rotateLabels(0)      //Angle to rotate x-axis labels.
        .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
        .groupSpacing(0.1)    //Distance between each group of bars.
      ;

      chart.xAxis.tickFormat();
      chart.yAxis.tickFormat(d3.format('2s'));

      chart.margin({left: 80, bottom: 80 });

      chart.xAxis
        .axisLabel('Vuosi')
        .axisLabelDistance(10);

      chart.yAxis
        .axisLabel(options.yTitle)
        .axisLabelDistance(10);

      d3.select(this.element.getElementsByTagName('svg')[0])
        .datum(parseData())
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
  }
}
