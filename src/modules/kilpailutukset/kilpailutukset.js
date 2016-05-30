import {Api} from 'services/api';
import {EventAggregator} from 'aurelia-event-aggregator';
import {I18N} from 'aurelia-i18n';
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import moment from 'moment';
import 'moment/locale/fi';
import 'fetch';
import _ from 'lodash';
import $ from 'jquery';
import * as c from 'utils/core';
import * as t from 'utils/time';
import * as tl from 'utils/tunnusluvut';
import R from 'ramda';
import 'wnumb';

@inject(Api, EventAggregator, HttpClient, I18N, Router)
export class Kilpailutukset {

  constructor(api, eventAggregator, http, i18n, router) {
    this.api = api;
    this.ea = eventAggregator;
    this.i18n = i18n;
    this.router = router;

    this.timeline = {};

    this.filter = {
      organisaatiot: [],
      organisaatiolajit: []
    };

    this.kilpailutukset = [];

    this.organisaatiolajit = _.map(_.filter(tl.organisaatiolajit.$order, id => id !== 'ALL'), id => ({id: id, nimi: tl.organisaatiolajit.$nimi(id)}));

    this.organisaatioSelectOptions = {
      placeholder: this.i18n.tr('suodata-aikajanaa-valitsemalla-viranomaisia')
    };

    this.organisaatiolajiSelectOptions = {
      placeholder: this.i18n.tr('suodata-aikajanaa-valitsemalla-toimivaltaryhmia')
    };

    this.kohdearvo = {
      start: [0, 5],
      connect: true,
      margin: 1,
      range: {
        min: 0,
        max: 10
      },
      step: 0.1
    };

    this.kalustokoko = {
      start: [0, 100],
      connect: true,
      margin: 10,
      range: {
        min: 0,
        max: 100
      },
      step: 1,
      format: wNumb({
        decimals: 0
      })
    };

    this.isKilpailutuskausiChecked = false;
    this.isLiikennointikausiChecked = false;
    this.currentKohdearvo = null;
    this.currentKalustokoko = null;

    this.labels = [{
      text: this.i18n.tr('tarjousaika'),
      color: '#3385D6'
    }, {
      text: this.i18n.tr('tarjousten-kasittely-ja-hankintapaatos'),
      color: '#C266EB'
    }, {
      text: this.i18n.tr('liikennoinnin-valmistelu'),
      color: '#FFA033'
    }, {
      text: this.i18n.tr('liikennointi-sopimuskausi'),
      color: '#33BB33'
    }, {
      text: this.i18n.tr('hankitut-optiot'),
      color: '#66CCD6'
    }, {
      text: this.i18n.tr('optiot-kokonaisuudessaan'),
      color: '#cfeff2',
      border: '1px dashed #66CCD6'
    }];

    window.moment = moment;


    this.timeline.options = {
      locale: 'fi',
      groupOrder: 'id',
      margin: {
        item: 6
      },
      stack: false,
      clickToUse: false,
      orientation: 'both',
      zoomMin: 604800000,
      zoomMax: 1262400000000
    };

    this.timeline.events = {
      select: (properties) => {
        let $target = $(properties.event.target);
        if (!$target.hasClass('link-to-hilma')) {
          let url = `/kilpailutukset/${ _.split(properties.items[0], '-')[1] }`;
          this.router.navigate(url);
        }
      }
    };

    this.http = http;

    this.api.organisaatiot.then(data => {
      this.organisaatiot = data;
      this.timeline.organisaatiot = data;
      this.valitutOrganisaatiot = R.map(R.prop('id'), this.organisaatiot);
    });

    this.ea.subscribe('kalustokoko-slider-update', params => {
      this.currentKalustokoko = R.clone(this.kalustokoko);
      this.currentKalustokoko.start = R.map(value => { return parseInt(value, 10); }, params.start);
      this.filterTimelineKilpailutukset();
    });

    this.ea.subscribe('kohdearvo-slider-update', params => {
      this.currentKohdearvo = R.clone(this.kohdearvo);
      this.currentKohdearvo.start = R.map(value => { return parseFloat(value); }, params.start);
      this.filterTimelineKilpailutukset();
    });

    this.loadKilpailutukset();
  }

  findOrganisaatioById = (id) => {
    let intId = parseInt(id, 10);
    return R.filter(R.propEq('id', intId), this.organisaatiot)[0];
  }

  filterTimelineOrganisaatiot = () => {
    let findOrganisaatiotInLajit = lajitunnukset => {
      return _.isEmpty(lajitunnukset) ? [] :
        _.filter(this.organisaatiot, org => _.includes(lajitunnukset, org.lajitunnus));
    };
    let organisaatiolajitunnukset = this.filter.organisaatiolajit;
    let organisaatiot = _.unionBy(
      R.map(this.findOrganisaatioById, this.filter.organisaatiot), findOrganisaatiotInLajit(organisaatiolajitunnukset),
      org => org.id);
    if (_.isEmpty(organisaatiot)) {
      this.timeline.organisaatiot = this.organisaatiot;
    } else {
      this.timeline.organisaatiot = organisaatiot;
    }
  }

  filterTimelineKilpailutukset = () => {
    let kalustokoko = this.currentKalustokoko || this.kalustokoko;
    let kohdearvo = this.currentKohdearvo || this.kohdearvo;
    const between = (arvo, interval, multiplier) => {
      let bool = arvo >= interval.start[0] * multiplier && arvo <= interval.start[1] * multiplier;
      return bool;
    };
    const isMaxInterval = (interval) => interval.start[0] === interval.range.min && interval.start[1] === interval.range.max;
    if (! (isMaxInterval(kalustokoko) && isMaxInterval(kohdearvo))) {
      this.timeline.kilpailutukset = _.filter(this.kilpailutukset,
        kilpailutus => between(kilpailutus.kalusto, kalustokoko, 1) &&
                       between(kilpailutus.kohdearvo, kohdearvo, 1000000) );
    } else {
      this.timeline.kilpailutukset = this.kilpailutukset;
    }
  };

  loadKilpailutukset = () => {
    const showKausi = (show, value) => show || (!this.isKilpailutuskausiChecked && !this.isLiikennointikausiChecked) ? value : null;
    const showKilpailutuskausi = (date) => showKausi(this.isKilpailutuskausiChecked, date);
    const showLiikennointikausi = (date) => showKausi(this.isLiikennointikausiChecked, date);

    this.api.kilpailutukset.then(data => {
      this.kilpailutukset = _.map(data, kilpailutus => {
        const dates = [
          showKilpailutuskausi(kilpailutus.julkaisupvm),
          showKilpailutuskausi(kilpailutus.tarjouspaattymispvm),
          showKilpailutuskausi(kilpailutus.hankintapaatospvm),
          kilpailutus.liikennointialoituspvm,
          showLiikennointikausi(kilpailutus.liikennointipaattymispvm),
          showLiikennointikausi(c.coalesce(kilpailutus.hankittuoptiopaattymispvm, kilpailutus.liikennointipaattymispvm)),
          showLiikennointikausi(kilpailutus.optiopaattymispvm)];

        const maxdate = _.max(dates);

        if (c.isBlank(maxdate)) {
          throw new Error('Kilpailutuksella ' + kilpailutus.id + ' ei ole yhtään päivämäärää.');
        }

        kilpailutus.dates = _.map(dates, (date, index) => t.toLocalMidnight(c.isNotBlank(date) ?
          date :
          c.coalesce(_.find(_.slice(dates, index), c.isNotBlank), maxdate)));

        return kilpailutus;
      });
      this.filterTimelineKilpailutukset();
    });
  }

  onOrganisaatioListChange() { return this.filterTimelineOrganisaatiot(); }
  onOrganisaatiolajiListChange() { return this.filterTimelineOrganisaatiot(); }
  toggleKilpailukausi() { return this.loadKilpailutukset(); }
  toggleLiikennointikausi() { return this.loadKilpailutukset(); }

}
