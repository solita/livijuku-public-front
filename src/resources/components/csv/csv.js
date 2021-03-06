import {bindable} from 'aurelia-framework';
import R from 'ramda';
import saveAs from 'file-saver';
import * as c from 'resources/utils/core';

export const quote = (columnDelimeter, quoteChar, value) =>
  R.contains(columnDelimeter, value) ?
    quoteChar + R.replace(new RegExp(quoteChar, 'g'), quoteChar + quoteChar, value.toString()) + quoteChar :
    value;

export const quoteLine = (line, columnDelimeter, quoteChar) =>
  R.map(cell => quote(columnDelimeter, quoteChar, c.coalesce(cell, '')), line);

export const convertToCSV = (data, lineDelimeter, columnDelimeter, quoteChar) =>
  R.join(lineDelimeter, R.map(line => R.join(columnDelimeter, quoteLine(line, columnDelimeter, quoteChar)), data));

export class CsvCustomElement {

  @bindable data;
  @bindable filename;
  @bindable columnDelimiter;

  downloadCSV = () => {

    const filename = this.filename + '.csv' || 'export.csv';
    const csv = convertToCSV(this.data,
      c.coalesce(this.lineDelimiter, '\n'),
      c.coalesce(this.columnDelimiter, ';'),
    '"');

    if (csv === null) return;

    const blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
    saveAs(blob, filename);
  };

}
