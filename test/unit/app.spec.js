import {App} from '../../src/app';

describe('the app', () => {
  it('menu is closed by default', () => {
    expect(new App().isMenuOpen).toBe(false);
  });
});
