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

  it('should have a etusivu route', () => {
    expect(sut.router.routes).toContain({ route: ['', 'etusivu'],   name: 'etusivu',  moduleId: 'modules/etusivu/etusivu',  nav: false, title: 'Etusivu' });
  });

  it('should have valtionavustukset route', () => {
    expect(sut.router.routes).toContain({ route: 'tilastot/valtionavustukset',  name: 'valtionavustukset',  moduleId: 'modules/tilastot/valtionavustukset/valtionavustukset', nav: true, title: 'Valtionavustukset' });
  });

  it('should have perustunnusluvut route', () => {
    expect(sut.router.routes).toContain({ route: 'tilastot/perus',  name: 'perus',  moduleId: 'modules/tilastot/perustunnusluvut/perustunnusluvut', nav: true, title: 'Perustunnusluvut' });
  });

  it('should have kaikkiTunnusluvut route', () => {
    expect(sut.router.routes).toContain({ route: 'tilastot/kaikki',  name: 'kaikki',  moduleId: 'modules/tilastot/kaikki-tunnusluvut/kaikki-tunnusluvut', nav: true, title: 'Kaikki tunnusluvut' });
  });

  it('should have kilpailutukset route', () => {
    expect(sut.router.routes).toContain({ route: 'kilpailutukset',  name: 'kilpailutukset',  moduleId: 'modules/kilpailutukset/kilpailutukset', nav: true, title: 'Kilpailutukset' });
  });

  it('should have kilpailutukset/:id route', () => {
    expect(sut.router.routes).toContain({ route: 'kilpailutukset/:id',  name: 'kilpailutus',  moduleId: 'modules/kilpailutus/kilpailutus', nav: false, title: 'Kilpailutus' });
  });

  it('should have method onPanelItemClick', () => {
    expect(sut.onPanelItemClick).toBeDefined();
  });

});
