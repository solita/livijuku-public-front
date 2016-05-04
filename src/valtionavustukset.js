import {I18N} from 'aurelia-i18n';
import {inject} from 'aurelia-framework';
import {Cookie} from 'aurelia-cookie';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import R from 'ramda';
import 'fetch';

@inject(EventAggregator, HttpClient, I18N, Router)
export class Valtionavustukset {

  constructor(eventAggregator, http, i18n, router) {
    this.ea = eventAggregator;
    this.haetutMyonnetytKey = 'M';
    this.i18n = i18n;
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
      });
    this.router = router;
    this.chartOptions = {};
  }

  attached() {
    Cookie.set('XSRF-TOKEN', 'juku');
    this.ea.subscribe('router:navigation:success', router => {
      this.childRoute = router.instruction.params.childRoute;
      if (router.instruction.fragment.indexOf('valtionavustukset') !== -1 && !this.childRoute) {
        // return this.router.navigate('valtionavustukset/ALL');
      }
      this.http.fetch('avustus/' + this.childRoute)
        .then(response => response.json())
        .then(data => {
          console.info(data);
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('avustustyyppi', R.head(data)), data);
          let groupLabels = [this.i18n.tr('haetut'), this.i18n.tr('myonnetyt')];
          this.haetutJaMyonnetytAvustukset = R.merge(this.chartOptions, {
            data: data,
            options: {
              groupKeys: groupKeys,
              groupLabels: groupLabels,
              xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
              valueIndex: R.indexOf('sum(rahamaara)', R.head(data)),
              title: 'joukkoliikenteen-haetut-ja-myonnetut-avustukset',
              subtitle: this.childRoute,
              height: 600,
              chart: {
                xAxis: {
                  axisLabel: this.i18n.tr('vuosi')
                },
                yAxis: {
                  axisLabel: '€'
                }
              }
            }
          });
        });
      // this.http.fetch('avustus-details/' + this.childRoute)
      //   .then(response => response.json())
      //   .then(data => {
      //     let xLabelIndex = R.indexOf('vuosi', R.head(data));
      //     let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
      //     let groupLabels = this.getOrganisaatioNames(groupKeys);
      //     this.haetutAvustuksetOrganisaatioittain = R.merge(this.chartOptions, {
      //       data: data,
      //       options: {
      //         groupKeys: groupKeys,
      //         groupLabels: groupLabels,
      //         xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
      //         valueIndex: R.indexOf('haettavaavustus', R.head(data)),
      //         title: 'haetut-avustukset-organisaatioittain',
      //         subtitle: this.childRoute,
      //         height: 600
      //       }
      //     });
      //     this.myonnetytAvustuksetOrganisaatioittain = R.merge(this.chartOptions, {
      //       data: data,
      //       options: {
      //         groupKeys: groupKeys,
      //         groupLabels: groupLabels,
      //         xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
      //         valueIndex: R.indexOf('myonnettyavustus', R.head(data)),
      //         title: 'myonnetyt-avustukset-organisaatioittain',
      //         subtitle: this.childRoute,
      //         height: 600
      //       }
      //     });
      //   });
      // this.http.fetch('avustus-asukas/' + this.childRoute)
      //   .then(response => response.json())
      //   .then(data => {
      //     let xLabelIndex = R.indexOf('vuosi', R.head(data));
      //     let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
      //     let groupLabels = this.getOrganisaatioNames(groupKeys);
      //     this.avustusPerAsukas = R.merge(this.chartOptions, {
      //       data: data,
      //       options: {
      //         groupKeys: groupKeys,
      //         groupLabels: groupLabels,
      //         xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
      //         valueIndex: R.indexOf('myonnettyavustus_asukastakohti', R.head(data)),
      //         title: 'myonnetty-avustus-per-asukas',
      //         subtitle: this.childRoute,
      //         height: 600
      //       }
      //     });
      //   });
    });
  }

  getGroupKeys = (groupIndex, data) => {
    return R.sort((a, b) => {
      return a - b;
    }, R.uniq(R.map(item => {
      return item[groupIndex];
    }, R.tail(data))));
  }

  getOrganisaatioNames = (groupKeys) => {
    return R.map(key => {
      return R.filter(R.propEq('id', key))(this.organisaatiot)[0].nimi;
    }, groupKeys);
  }

  toggleHaetutMyonnetytKey() {
    this.haetutMyonnetytKey = this.haetutMyonnetytKey === 'M' ? 'H' : 'M';
  }
}
