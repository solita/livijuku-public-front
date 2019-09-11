# JUKU

Sivusto joukkoliikenteen valtionrahoituksesta ja tunnusluvuista

## Kehitysympäristön käynnistys

Projekti käyttää [Aurelia](http://www.aurelia.io)-sovelluskehystä sekä Googlen [Polymer](https://www.polymer-project.org/1.0/)-kirjaston käyttöliittymäkomponentteja. Projektin build- ja bundle-prosessit ajetaan `aurelia-cli` pakettia käyttäen. Tyylit on kirjoitettu atomisesti hyödyntäen Solitalla tehtyä [Once-kirjasto](https://github.com/niant/once)a.

* Asenna nvm - https://github.com/creationix/nvm.
* Lataa [livijuku](https://github.com/solita/livijuku)-projekti ja suorita README:n mukaiset toimenpiteet.
* Kun tietokanta ja backend ovat ajossa (`localhost:8080`), voit käynnistää tämän projektin seuraavasti:
  * Siirry projektikansioon
  * Suorita `nvm use`
  * Suorita `npm install`
  * Suorita `npm run bower:install`
  * Suorita `npm run localdev`
    * Komento käynnistää fronttipalvelimen ja tarkkailee tiedostoissa tapahtuvia muutoksia päivittäen selainikkunan muutosten tapahtuessa.
  * Siirry osoitteeseen [http://localhost:9000](http://localhost:9000)
