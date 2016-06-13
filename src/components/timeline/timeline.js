import {bindable, inject} from 'aurelia-framework';
import $ from 'jquery';
import vis from 'vis';
import _ from 'lodash';
import * as c from 'utils/core';

@inject(Element)
export class TimelineCustomElement {

  @bindable events;
  @bindable data;
  @bindable options;

  constructor(element) {
    this.element = element;
    this.colors = [
      ['#3385D6', '#ffffff', '1px solid #3385D6'],
      ['#C266EB', '#ffffff', '1px solid #C266EB'],
      ['#FFA033', '#ffffff', '1px solid #FFA033'],
      ['#33BB33', '#ffffff', '1px solid #33BB33'],
      ['#66CCD6', '#ffffff', '1px solid #66CCD6'],
      ['#cfeff2', '#ffffff', '1px dashed #66CCD6; border-left-style: solid']
    ];
  }

  bind() {
    this.timeline = new vis.Timeline($(this.element).find('div')[0]);
    this.refresh();
  }

  dataChanged() { this.refresh(); }

  refresh() {
    this.kilpailutukset = this.data.kilpailutukset;
    this.organisaatiot = this.data.organisaatiot;
    const groups = _.map(this.organisaatiot, organisaatio => ({
      id: organisaatio.id,
      content: organisaatio.nimi
    }));
    const items = _.flatMap(this.kilpailutukset, kilpailutus => {

      const allIntervals = _.map(_.initial(kilpailutus.dates), (startDate, index) => ({
        index: index,
        start: startDate,
        end: _.find(_.slice(kilpailutus.dates, index + 1), c.isDefinedNotNull)
      }));
      const intervals = _.filter(allIntervals,
        interval => _.every(_.values(interval), c.isDefinedNotNull) &&
                    !_.isEqual(interval.start, interval.end));

      if (_.isEmpty(intervals)) {
        throw "Kilpailutuksella " + kilpailutus.id + " ei ole määritelty kahta päivämäärää."
      }

      var subgroup = _.map(intervals, interval => ({
        id: kilpailutus.organisaatioid + '-' + kilpailutus.id + '-' + interval.index,
        type: 'range',
        content: '&nbsp;',
        start: interval.start,
        end: interval.end,
        group: kilpailutus.organisaatioid,
        subgroup: kilpailutus.id,
        title: kilpailutus.kohdenimi,
        style: 'background-color: ' + this.colors[interval.index][0] + '; color: ' + this.colors[interval.index][1] + '; border: ' + this.colors[interval.index][2] + '; height: 24px;'
      }));

      subgroup.push({
        id: kilpailutus.organisaatioid + '-' + kilpailutus.id + '-' + (kilpailutus.dates.length - 1),
        content: kilpailutus.kohdenimi,
        start: _.first(intervals).start,
        end: _.last(intervals).end,
        group: kilpailutus.organisaatioid,
        subgroup: kilpailutus.id,
        title: kilpailutus.kohdenimi,
        style: 'background-color: transparent; color: white; border: 1px solid transparent; z-index: 2; height: 24px; line-height: 10px; ',
        linkToHilma: kilpailutus.hilmalinkki
      });
      return subgroup;
    });

    this.options.template = (item) => {
      let markup = item.content;
      if (item.linkToHilma) {
        markup = '<p class="M-0 f-12 c-w">' + item.content + ' &nbsp; <a class="f-w-700 P-xxs B-r-xs f-10 f-no-decoration f-underline__hover link-to-hilma bg-c-w" target="_blank" href="' + item.linkToHilma + '">HILMA</a></p>';
      }
      return markup;
    };

    this.timeline.setOptions(this.options);

    _.map(this.events, (event, key) => {
      this.timeline.on(key, event);
    });

    this.timeline.setData({ groups, items });
  }
}
