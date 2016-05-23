import {App} from '../../src/app';

class RouterStub {
  configure(handler) {
    handler(this);
  }

  map(routes) {
    this.routes = routes;
  }
}

describe('the App module', () => {
  var sut;
  var mockedRouter;

  beforeEach(() => {
    mockedRouter = new RouterStub();
    sut = new App();
    sut.configureRouter(mockedRouter, mockedRouter);
  });

  it('contains a router property', () => {
    expect(sut.router).toBeDefined();
  });

  it('configures the router title', () => {
    expect(sut.router.title).toEqual('JUKU');
  });

  it('should have a welcome route', () => {
    expect(sut.router.routes).toContain({ route: ['', 'etusivu'],   name: 'etusivu',  moduleId: 'etusivu',  nav: false, title: 'Etusivu' });
  });

  it('should have valtionavustukset route', () => {
    expect(sut.router.routes).toContain({ route: 'valtionavustukset',  name: 'valtionavustukset',  moduleId: 'valtionavustukset', nav: true, title: 'Valtionavustukset' });
  });

  it('should have perustunnusluvut route', () => {
    expect(sut.router.routes).toContain({ route: 'perustunnusluvut',  name: 'perustunnusluvut',  moduleId: 'perustunnusluvut', nav: true, title: 'Perustunnusluvut' });
  });

  it('should have kaikkiTunnusluvut route', () => {
    expect(sut.router.routes).toContain({ route: 'kaikkiTunnusluvut',  name: 'kaikkiTunnusluvut',  moduleId: 'kaikkiTunnusluvut', nav: true, title: 'Kaikki tunnusluvut' });
  });

  it('should have kilpailutukset route', () => {
    expect(sut.router.routes).toContain({ route: 'kilpailutukset',  name: 'kilpailutukset',  moduleId: 'kilpailutukset', nav: true, title: 'Kilpailutukset' });
  });

  it('should have kilpailutukset/:id route', () => {
    expect(sut.router.routes).toContain({ route: 'kilpailutukset/:id',  name: 'kilpailutus',  moduleId: 'kilpailutus', nav: false, title: 'Kilpailutus' });
  });

});
