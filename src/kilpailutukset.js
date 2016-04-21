export class Kilpailutukset {

  constructor() {
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

    this.organisaatiot = [{
      id: 1,
      nimi: 'Helsinki'
    }, {
      id: 2,
      nimi: 'Turku'
    }];

    this.timelineOptions = {
      locales: {
        fi: {
          months: ['Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu']
        }
      },
      locale: 'fi',
      min: new Date(2000, 1, 1),
      max: new Date(2050, 1, 1),
      stack: false,
      clickToUse: true,
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
  }
}
