import {bindable, inject} from 'aurelia-framework';
import vis from 'vis';

@inject(Element)
export class TimelineCustomElement {

  @bindable events;
  @bindable kilpailutukset;
  @bindable options;
  @bindable organisaatiot;

  constructor(element) {
    this.element = element;
  }

  bind() {
    let timeline = new vis.Timeline(this.element);
    let groups = [];
    let items = [];
    let colors = [
        { 0: '#2479B2', 1: '#ffffff' },
        { 0: '#35ACFF', 1: '#ffffff' },
        { 0: '#B27215', 1: '#ffffff' },
        { 0: '#FFA829', 1: '#ffffff' }
    ];
    let i = 0;
    let ii = 0;

    if (this.organisaatiot && Object.keys(this.organisaatiot).length) {
      for (i = 0; i < this.organisaatiot.length; i += 1) {
        groups.push({
          id: this.organisaatiot[i].id,
          content: this.organisaatiot[i].nimi
        });
      }

      for (i = 0; i < this.kilpailutukset.length; i += 1) {
        for (ii = 0; ii < this.kilpailutukset[i].dates.length - 1; ii += 1) {
          items.push({
            id: this.kilpailutukset[i].organisaatioId + '-' + this.kilpailutukset[i].id + '-' + ii,
            content: '&nbsp;',
            start: this.kilpailutukset[i].dates[ii],
            end: this.kilpailutukset[i].dates[ii + 1],
            group: this.kilpailutukset[i].organisaatioId,
            subgroup: this.kilpailutukset[i].id,
            title: this.kilpailutukset[i].name,
            style: 'background-color: ' + (colors[ii][0] ? colors[ii][0] : 'brown') + '; color: ' + (colors[ii][1] ? colors[ii][1] : '#ffffff') + '; border: none;'
          });
        }

        items.push({
          id: this.kilpailutukset[i].organisaatioId + '-' + this.kilpailutukset[i].id + '-' + ii,
          content: this.kilpailutukset[i].name,
          start: this.kilpailutukset[i].dates[0],
          end: this.kilpailutukset[i].dates[ii],
          group: this.kilpailutukset[i].organisaatioId,
          subgroup: this.kilpailutukset[i].id,
          title: this.kilpailutukset[i].name,
          style: 'background-color: transparent; color: white; border: none; z-index: 2;',
          linkToHilma: this.kilpailutukset[i].linkToHilma
        });
      }

      this.options.template = (item) => {
        let value = item.linkToHilma ? '<p style="margin: 0;">' + item.content + ' <a class="link-to-hilma" href="' + item.linkToHilma + '" style="background-color: #ffffff; text-transform: uppercase; font-size: 10px; border-radius: 4px; padding: 0.2em;">Hilma</a></p>' : item.content;
        return value;
      };

      timeline.setOptions(this.options);

      Object.keys(this.events).forEach(key => {
        timeline.on(key, this.events[key]);
      });

      timeline.setData({
        groups: groups,
        items: items
      });
    }
  }

}
