import {I18N} from 'aurelia-i18n';
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import $ from 'jquery';
import 'fetch';
import * as tl from 'utils/tunnusluvut';
import _ from 'lodash';
import wnumb from 'wnumb';

@inject(HttpClient, I18N)
export class Kilpailutukset {

  constructor(http, i18n) {
    this.i18n = i18n;

    this.organisaatiolajit = _.map(_.filter(tl.organisaatiolajit.$order, id => id !== 'ALL'), id => ({id: id, nimi: tl.organisaatiolajit.$nimi(id)}));

    this.kohdearvo = {
      start: [0, 10],
      connect: true,
      margin: 1,
      range: {
        min: 0,
        max: 10
      },
      step: 1,
      format: wNumb({
    		decimals: 2,
    		thousand: '.'
    	})
    };

    this.kalustokoko = {
      start: [0, 100],
      connect: true,
      margin: 10,
      range: {
        min: 0,
        max: 100
      },
      step: 5,
      format: wNumb({
    		decimals: 0
    	})
    };

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

    this.kilpailutukset = [{
      id: 'kohde-1',
      organisaatioId: 1,
      name: 'Kohde 1',
      dates: [new Date('2016-04-20'), new Date('2016-06-20'), new Date('2016-09-20'), new Date('2016-12-20'), new Date('2017-12-20')],
      linkToHilma: 'http://www.hankintailmoitukset.fi/fi/'
    }, {
      id: 'kohde-2',
      organisaatioId: 1,
      name: 'Kohde 2',
      dates: [new Date('2016-03-01'), new Date('2016-06-30'), new Date('2016-10-01'), new Date('2017-01-01'), new Date('2018-10-20')],
      linkToHilma: false
    }, {
      id: 'kohde-1',
      organisaatioId: 2,
      name: 'Kohde 1',
      dates: [new Date('2016-04-20'), new Date('2016-06-20'), new Date('2016-09-20'), new Date('2017-02-20'), new Date('2019-12-20')],
      linkToHilma: 'http://www.hankintailmoitukset.fi/fi/'
    }];

    this.timelineOptions = {
      locale: 'fi',
      groupOrder: 'id',
      margin: {
        item: 6
      },
      stack: false,
      clickToUse: false,
      orientation: 'both'
    };

    this.timelineEvents = {
      select: (properties) => {
        // let $target = jQuery(properties.event.target);
        // if (!$target.hasClass('link-to-hilma')) {
        //   $state.go('app.kilpailutus', {
        //     id: properties.items[0]
        //   });
        // }
      }
    };

    http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl('api/')
        .withInterceptor({
          request: function(request) {
            request.headers.set('x-xsrf-token', 'juku');
            return request;
          }
        });
    });
    this.http = http;
    this.http.fetch('organisaatiot')
      .then(response => response.json())
      .then(data => {
        this.organisaatiot = data;
        console.info(this.organisaatiot);
      });
    // this.http.fetch('kilpailutukset')
    //   .then(response => response.json())
    //   .then(data => {
    //     this.kilpailutukset = data;
    //     console.info(this.kilpailutukset);
    //   });
  }
}
