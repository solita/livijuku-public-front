import {customAttribute, inject} from 'aurelia-framework';
import $ from 'jquery';
import 'select2'; // install the select2 jquery plugin
// import 'select2/css/select2.min.css!' // ensure the select2 stylesheet has been loaded

@customAttribute('select2')
@inject(Element)
export class Select2CustomAttribute {
  constructor(element) {
    this.element = element;
    this.placeholder = 'Valitse arvot luettelosta';
  }

  attached() {
    $(this.element)
     .select2({
       placeholder: this.placeholder
     }, this.value)
     .on('change', evt => {
       if (evt.originalEvent) { return; }
       this.element.dispatchEvent(new Event('change'));
     });
  }

  detached() {
    $(this.element).select2('destroy');
  }

  valueChanged(value) {
    this.placeholder = value.placeholder;
  }

}
