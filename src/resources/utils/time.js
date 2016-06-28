import _ from 'lodash';

export function toISOString(date) {
  return date.toISOString().split('T')[0];
}

export function toUTCTimestamp(dateString) {
  return new Date(Date.parse(dateString + 'T00:00:00Z'));
}

export function convertDateToUTC(d) {
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0);
}

export function getUTCDateTimestamp() {
  let now = new Date();
  return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0);
}

export function toLocalMidnight(isoDateString) {
  const date = _.map(_.split(isoDateString, '-'), _.toNumber);
  return new Date(date[0], date[1] - 1, date[2]);
}
