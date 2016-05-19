import {bindable, inject} from 'aurelia-framework';
import $ from 'jquery';
import vis from 'vis';
import _ from 'lodash';

@inject(Element)
export class TimelineCustomElement {

  @bindable events;
  @bindable kilpailutukset;
  @bindable options;
  @bindable organisaatiot;

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
  }

  kilpailutuksetChanged() { this.refresh(); }
  organisaatiotChanged() { this.refresh(); }

  refresh() {
    const groups = _.map(this.organisaatiot, organisaatio => ({
      id: organisaatio.id,
      content: organisaatio.nimi
    }));
    const items = _.flatMap(this.kilpailutukset, kilpailutus => {
      let subgroup = _.map(_.initial(kilpailutus.dates), (startDate, index) => ({
        id: kilpailutus.organisaatioid + '-' + kilpailutus.id + '-' + index,
        type: 'range',
        content: '&nbsp;',
        start: startDate,
        end: kilpailutus.dates[index + 1],
        group: kilpailutus.organisaatioid,
        subgroup: kilpailutus.id,
        title: kilpailutus.kohdenimi,
        style: 'background-color: ' + this.colors[index][0] + '; color: ' + this.colors[index][1] + '; border: ' + this.colors[index][2] + '; height: 24px;'
      }));

      subgroup.push({
        id: kilpailutus.organisaatioid + '-' + kilpailutus.id + '-' + (kilpailutus.dates.length - 1),
        content: kilpailutus.kohdenimi,
        start: _.first(kilpailutus.dates),
        end: _.last(kilpailutus.dates),
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

    this.timeline.setData({
      groups: groups,
      items: items
    });
  }
}
