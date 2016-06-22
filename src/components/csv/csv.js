import {bindable} from 'aurelia-framework';
import R from 'ramda';

export class CsvCustomElement {

  @bindable data;
  @bindable filename;
  @bindable columnDelimiter;

  downloadCSV = () => {
    let convertArrayOfObjectsToCSV = () => {
      let result;
      let ctr;
      let keys;
      let columnDelimiter;
      let lineDelimiter;
      let data = this.data || null;
      if (R.isNil(data)) {
        return null;
      }
      columnDelimiter = this.columnDelimiter || ',';
      lineDelimiter = this.lineDelimiter || '\n';

      keys = Object.keys(data[0]);

      result = '';
      result += keys.join(columnDelimiter);
      result += lineDelimiter;

      data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
          if (ctr > 0) result += columnDelimiter;

          result += item[key];
          ctr++;
        });
        result += lineDelimiter;
      });
      return result;
    };

    let filename;
    let link;
    let csv = convertArrayOfObjectsToCSV();
    if (csv === null) return;

    filename = this.filename + '.csv' || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    let data = encodeURI(csv);

    link = document.createElement('a');
    link.style = 'visibility:hidden';
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

}
