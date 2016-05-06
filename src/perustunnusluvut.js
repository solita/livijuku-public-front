import {I18N} from 'aurelia-i18n';
import {inject} from 'aurelia-framework';
import {Cookie} from 'aurelia-cookie';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import {Tunnusluvut} from 'services/tunnusluvut';
import R from 'ramda';
import 'fetch';

@inject(EventAggregator, HttpClient, I18N, Router, Tunnusluvut)
export class Perustunnusluvut {

  constructor(eventAggregator, http, i18n, router, tunnusluvut) {
    this.ea = eventAggregator;
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
    this.i18n = i18n;
    this.router = router;
    this.tunnusluvut = tunnusluvut;
  }

  attached() {
    Cookie.set('XSRF-TOKEN', 'juku');
    this.ea.subscribe('router:navigation:success', router => {
      this.childRoute = router.instruction.params.childRoute;
      if (router.instruction.fragment.indexOf('perustunnusluvut') !== -1 && !this.childRoute) {
        // this.router.navigate('perustunnusluvut/ALL');
      }
      this.http.fetch('tilastot/alue-asiakastyytyvaisyys/' + this.childRoute + '?group-by=organisaatioid&group-by=vuosi')
        .then(response => response.json())
        .then(data => {
          let chartOptions = this.tunnusluvut.asiakastyytyvaisyys();
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOptions.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('tunnusluku', R.head(data)),
            title: 'tyytyvaisyys-joukkoliikenteeseen',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.tyytyvaisyysJoukkoliikenteeseen = {
            data: data,
            options: o
          }
        });
      this.http.fetch('tilastot/nousut/' + this.childRoute + '?group-by=organisaatioid&group-by=vuosi')
        .then(response => response.json())
        .then(data => {
          let chartOptions = this.tunnusluvut.nousut();
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOptions.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('tunnusluku', R.head(data)),
            title: 'matkustajamaarat',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.nousut = {
            data: data,
            options: o
          }
        });
      this.http.fetch('tilastot/lahdot/' + this.childRoute + '?group-by=organisaatioid&group-by=vuosi')
        .then(response => response.json())
        .then(data => {
          let chartOptions = this.tunnusluvut.lahdot();
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOptions.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('tunnusluku', R.head(data)),
            title: 'lahtojen-maara',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.lahdot = {
            data: data,
            options: o
          }
        });
      this.http.fetch('tilastot/linjakilometrit/' + this.childRoute + '?group-by=organisaatioid&group-by=vuosi')
        .then(response => response.json())
        .then(data => {
          let chartOptions = this.tunnusluvut.linjakilometrit();
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOptions.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('tunnusluku', R.head(data)),
            title: 'linjakilometrit',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.linjakilometrit = {
            data: data,
            options: o
          }
        });
      this.http.fetch('avustus-asukas/' + this.childRoute)
        .then(response => response.json())
        .then(data => {
          let chartOptions = this.tunnusluvut.avustusperasukas();
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOptions.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('myonnettyavustus_asukastakohti', R.head(data)),
            title: 'valtion-rahoitus-asukasta-kohden',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.valtionAvustusPerAsukas = {
            data: data,
            options: o
          }
        });
      this.http.fetch('omarahoitus-asukas/' + this.childRoute)
        .then(response => response.json())
        .then(data => {
          let chartOptions = this.tunnusluvut.omarahoitusperasukas();
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOptions.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('myonnettyavustus_asukastakohti', R.head(data)),
            title: 'valtion-rahoitus-asukasta-kohden',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.omarahoitusPerAsukas = {
            data: data,
            options: o
          }
        });
      this.http.fetch('psa-nettokustannus/' + this.childRoute)
        .then(response => response.json())
        .then(data => {
          let chartOptions = this.tunnusluvut.psanettokustannus();
          let xLabelIndex = R.indexOf('vuosi', R.head(data));
          let groupKeys = this.getGroupKeys(R.indexOf('organisaatioid', R.head(data)), data);
          let groupLabels = this.getOrganisaatioNames(groupKeys);
          let o = R.merge(chartOptions.options, {
            groupKeys: groupKeys,
            groupLabels: groupLabels,
            xLabels: R.uniq(R.map(item => { return item[xLabelIndex]; }, R.tail(data))),
            valueIndex: R.indexOf('liikennointikorvaus.korvaus-lipputulo.total', R.head(data)),
            title: 'psa-liikenteen-nettokustannukset',
            subtitle: {
              text: this.i18n.tr(this.childRoute)
            },
            height: 600
          });
          this.psaNettokustannukset = {
            data: data,
            options: o
          }
        });
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

}
