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

  // Life-cycle methods

  constructor(api, eventAggregator, http, i18n, router) {
    this.api = api;
    this.ea = eventAggregator;
    this.i18n = i18n;
    this.router = router;
    this.lastFetch = null;
    this.timeline = {};
    this.promises = [];
    this.filter = {
      organisaatiot: [],
      organisaatiolajit: []
    };
    this.organisaatiolajit = _.map(_.filter(tl.organisaatiolajit.$order, id => id !== 'ALL'), id => ({id: id, nimi: tl.organisaatiolajit.$nimi(id)}));
    this.organisaatioSelectOptions = {
      placeholder: this.i18n.tr('suodata-aikajanaa-valitsemalla-viranomaisia')
    };
    this.organisaatiolajiSelectOptions = {
      placeholder: this.i18n.tr('suodata-aikajanaa-valitsemalla-toimivaltaryhmia')
    };
    this.labels = [{
      text: this.i18n.tr('tarjousaika'),
      color: '#3385D6',
      border: 'none'
    }, {
      text: this.i18n.tr('tarjousten-kasittely-ja-hankintapaatos'),
      color: '#C266EB',
      border: 'none'
    }, {
      text: this.i18n.tr('liikennoinnin-valmistelu'),
      color: '#FFA033',
      border: 'none'
    }, {
      text: this.i18n.tr('liikennointi-sopimuskausi'),
      color: '#33BB33',
      border: 'none'
    }, {
      text: this.i18n.tr('hankitut-optiot'),
      color: '#66CCD6',
      border: 'none'
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
          let url = `/kilpailutus/${ _.split(properties.items[0], '-')[1] }`;
          this.router.navigate(url);
        }
      }
    };

    this.http = http;
    this.subscriptions = [
      this.ea.subscribe('kalustokoko-slider-update', params => {
        return this.updateView('kal', params.start.join(','));
      }), this.ea.subscribe('kohdearvo-slider-update', params => {
        return this.updateView('arvo', params.start.join(','));
      })
    ];
  }

  activate(params) {
    this.subscriptions.push(this.ea.subscribe('router:navigation:success', router => {
      this.fetchAndParse(router.instruction.queryParams);
    }));
    return this.fetchAndParse(params);
  }

  detached() {
    R.forEach(subscription => {
      subscription.dispose();
    }, this.subscriptions);
  }

  // VM methods

  createPromises() {
    if (!this.lastFetch || (moment() - this.lastFetch) / 1000 / 60 > 1) {
      this.promises = [this.api.kilpailutukset, this.api.organisaatiot];
      this.lastFetch = moment();
    }
    return this.promises;
  }

  fetchAndParse = (params) => {
    if (!this.latestParams || R.not(R.equals(params, this.latestParams))) {
      let organisaatioIDs = params.o ? params.o.split(',') : [];
      let organisaatiolajit = params.og ? params.og.split(',') : [];
      this.kohdearvo = {
        start: params.arvo ? params.arvo.split(',') : [0, 5],
        connect: true,
        margin: 1,
        range: {
          min: 0,
          max: 10
        },
        step: 0.1
      };
      this.kalustokoko = {
        start: params.kal ? params.kal.split(',') : [0, 100],
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
      this.isKilpailutuskausiChecked = params.kil || false;
      this.isLiikennointikausiChecked = params.lii || false;
      return Promise.all(this.createPromises()).then(values => {
        let kilpailutukset = this.parseKilpailutukset(values[0]);
        kilpailutukset = R.filter(kilpailutus => {
          let arvo = kilpailutus.kohdearvo / 1000000;
          let kalusto = kilpailutus.kalusto;
          return c.checkIfInSelectedRange(this.kohdearvo.range.min, this.kohdearvo.range.max, parseFloat(this.kohdearvo.start[0]), parseFloat(this.kohdearvo.start[1]), arvo) &&
            c.checkIfInSelectedRange(this.kalustokoko.range.min, this.kalustokoko.range.max, parseFloat(this.kalustokoko.start[0]), parseFloat(this.kalustokoko.start[1]), kalusto);
        }, kilpailutukset);

        this.organisaatiot = R.filter(organisaatio => { return organisaatio.nimi !== 'Liikennevirasto'; }, values[1]);
        this.filter.organisaatiot = organisaatioIDs;
        this.filter.organisaatiolajit = organisaatiolajit;

        let allOrganisaatioIDs = R.map(organisaatio => {
          return organisaatio.id;
        }, this.organisaatiot);

        let activeOrganisaatioIDs = R.uniq(R.map(R.prop('organisaatioid'), values[0]));

        let inactiveOrganisaatioIDs = R.without(activeOrganisaatioIDs, allOrganisaatioIDs);

        this.inactiveOrganisaatiot = R.filter(organisaatio => {
          return R.indexOf(organisaatio.id, inactiveOrganisaatioIDs) !== -1;
        }, this.organisaatiot);

        this.activeOrganisaatiot = R.filter(organisaatio => {
          return R.indexOf(organisaatio.id, activeOrganisaatioIDs) !== -1;
        }, this.organisaatiot);

        let organisaatiot = R.filter(organisaatio => {
          return (R.indexOf(organisaatio.id.toString(), organisaatioIDs) !== -1 ||
            R.indexOf(organisaatio.lajitunnus, organisaatiolajit) !== -1) &&
            R.find(kilpailutus => {
              return kilpailutus.organisaatioid === organisaatio.id;
            }, kilpailutukset);
        }, this.organisaatiot);

        kilpailutukset = R.filter(kilpailutus => {
          return R.indexOf(kilpailutus.organisaatioid, R.map(R.prop('id'), organisaatiot)) !== -1;
        }, kilpailutukset);

        this.timeline.data = { organisaatiot, kilpailutukset };
      });
    }
    this.latestParams = R.clone(params);
  }

  onOrganisaatioListChange() {
    // TODO: Fix this ugly timeout hacking. This is made for Firefox and IE 11.
    setTimeout(() => {
      this.updateView('o', this.filter.organisaatiot.join(','));
    });
  }

  onOrganisaatiolajiListChange() {
    // TODO: Fix this ugly timeout hacking. This is made for Firefox an IE 11.
    setTimeout(() => {
      this.updateView('og', this.filter.organisaatiolajit.join(','));
    });
  }

  parseKilpailutukset = (data) => {
    const showKausi = (show, value) => show || (!this.isKilpailutuskausiChecked && !this.isLiikennointikausiChecked) ? value : null;
    const showKilpailutuskausi = (date) => showKausi(this.isKilpailutuskausiChecked, date);
    const showLiikennointikausi = (date) => showKausi(this.isLiikennointikausiChecked, date);

    let filterKilpailutuksetForKilpailutuskausi = kilpailutukset => {
      return this.isKilpailutuskausiChecked && !this.isLiikennointikausiChecked ?
        _.filter(kilpailutukset, k => _.some([k.julkaisupvm, k.tarjouspaattymispvm, k.hankintapaatospvm], c.isDefinedNotNull)) :
        kilpailutukset;
    };

    return R.map(kilpailutus => {
      const dates = [
        showKilpailutuskausi(kilpailutus.julkaisupvm),
        showKilpailutuskausi(kilpailutus.tarjouspaattymispvm),
        showKilpailutuskausi(kilpailutus.hankintapaatospvm),
        kilpailutus.liikennointialoituspvm,
        showLiikennointikausi(kilpailutus.liikennointipaattymispvm),
        showLiikennointikausi(c.coalesce(kilpailutus.hankittuoptiopaattymispvm, kilpailutus.liikennointipaattymispvm)),
        showLiikennointikausi(kilpailutus.optiopaattymispvm)];

      kilpailutus.dates = R.map(date => c.isNotBlank(date) ? t.toLocalMidnight(date) : null, dates);

      return kilpailutus;
    }, filterKilpailutuksetForKilpailutuskausi(data));
  };

  toggleKilpailukausi() {
    return this.updateView('kil', this.isKilpailutuskausiChecked);
  }

  toggleLiikennointikausi() {
    return this.updateView('lii', this.isLiikennointikausiChecked);
  }

  updateView(key, value) {
    if (this.router.currentInstruction) {
      if (value) {
        this.router.currentInstruction.queryParams[key] = value;
      } else {
        delete this.router.currentInstruction.queryParams[key];
      }
      this.router.navigateToRoute('kilpailutukset', this.router.currentInstruction.queryParams);
    }
  }
}
