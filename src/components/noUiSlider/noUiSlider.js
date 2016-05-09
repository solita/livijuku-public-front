import {bindable, inject} from 'aurelia-framework';
import noUiSlider from 'leongersen/noUiSlider';
import $ from 'jquery';

@inject(Element)
export class NoUiSliderCustomElement {

  @bindable options;

  constructor(element) {
    this.element = element;
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
  }

}
