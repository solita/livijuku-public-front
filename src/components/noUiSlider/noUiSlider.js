import {EventAggregator} from 'aurelia-event-aggregator';
import {bindable, inject} from 'aurelia-framework';
import noUiSlider from 'leongersen/noUiSlider';
import $ from 'jquery';

@inject(Element, EventAggregator)
export class NoUiSliderCustomElement {

  @bindable id;
  @bindable options;

  constructor(element, eventAggregator) {
    this.element = element;
    this.ea = eventAggregator;
  }

  attached() {
    let slider = noUiSlider.create($(this.element).find('.slider')[0], this.options);
    let snapValues = [
      $(this.element).find('.min')[0],
      $(this.element).find('.max')[0]
    ];

    slider.on('update', (values, handle) => {
      snapValues[handle].innerHTML = values[handle];
    });

    slider.on('set', (values, handle) => {
      this.ea.publish(this.id + '-slider-update', {
        start: values,
        handle: handle
      });
    });
  }

}
